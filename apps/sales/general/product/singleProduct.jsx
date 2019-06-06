/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {productSelected, setProductNew, applyPromoSingleLine, updateItemDiscount} from './actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    isVisible: store.products.singleProductVisible,
    product: store.products.sigleProductActive,
    salesWarehouse: store.userProfile.salesWarehouse,
    qty: store.products.singleProductQty,
    forcePrice: store.products.singleProductNewPrice,
    moneyDiscount: store.products.singleProductMoneyDiscount,
    client: store.clients.clientSelected,
    itemsInCart: store.cart.cartItems,
    globalDiscount: store.cart.globalDiscount,
    warehouse_id: store.userProfile.salesWarehouse,
    config: store.config.globalConf,
    priceListSelected: store.priceList.listSelected,
    usePriceListAsDefault: store.priceList.useAsDefault,
    cart: store.cart.cartItems
  }
})
export default class SingleProduct extends React.Component {

  componentWillMount() {

  }
  hidePanel () {
    this.props.dispatch({type: 'TOGGLE_SINGLE_PRODUCT_PANEL', payload: ''})
    this.props.dispatch({type: 'CLEAR_SINGLE_PRODUCT_QTY', payload: ''})
  }
  setSingleProductQty(ev) {
    if (ev.key == 'Enter') {
      this.addItemToCart()
    } else {
      const val = parseFloat(ev.target.value)
      this.props.dispatch({type: 'SET_SINGLE_PRODUCT_QTY', payload: val})
    }

  }
  addItemToCart() {
    const qty = this.props.qty ? this.props.qty : 1
    this.props.dispatch({type: 'HIDE_SINGLE_PRODUCT_PANEL', payload: ''})
    this.props.dispatch({type: 'CLEAR_SINGLE_PRODUCT_QTY', payload: ''})
    this.props.dispatch({type: 'productSearch_HIDE_SEARCH_PANEL', payload: ''})
    // this.props.dispatch(productSelected(this.props.product.code, qty, this.props.product, this.props.itemsInCart,
    //   this.props.globalDiscount, this.props.client, this.props.warehouse_id))
    const code = this.props.product.code
    const _this = this
    const setProductPromiseNew = new Promise((resolve, reject) => {
      const kwargs = {
        url: '/api/products/getProdPrice/',
        data: {
          prod_data: {
            code: code
          },
          clientId: _this.props.client.client.id
        }
      }

      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      setProductNew(kwargs, resolve, reject)
    })

    setProductPromiseNew.then((data) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      const product = data[0].product
      if (product.code == '00') {
        _this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
        _this.props.dispatch({type: 'SHOW_GENERAL_ITEM_PANEL', payload: ''})
      } else {
        // ADD THE DETAIL TO PRODUCT DETAIL OBJECTS
        _this.props.dispatch({type: 'ADD_TO_PRICES_DETAILS', payload: data[0]})
        this.props.dispatch(productSelected(data[0], qty, this.props.itemsInCart,
          this.props.client, this.props.warehouse_id, true, this.props.priceListSelected,
          this.props.usePriceListAsDefault, this.props.config.overrideXMLversion, this.props.dontCheckInv))
        _this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})
        _this.props.dispatch({type: 'SET_PRODUCT_ACTIVE_IN_CART', payload: code})
      }

    }).catch((err) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
    })
  }

  applyCurrencyDiscount() {
    const code = this.props.product.code
    const cartItems = this.props.cart
    const _this = this
    const indexInCart = cartItems.findIndex(cart => cart.product.code == code || cart.product.barcode == code)
    if (indexInCart != -1) {
      const line = cartItems[indexInCart]
      const applyCurrencyDiscountPromise = new Promise((resolve, reject) => {
        const kwargs = {
          url: '/api/products/getProdPrice/',
          data: {
            clientId: _this.props.client.client.id,
            prod_data: {
              code: code,
              qty: line.qty,
              promo_string: line.pricesData.promo_string,
              // THE VARIABLE CHANGED IN THIS METHOD IS THE MONEY DISCOUNT
              money_discount: _this.props.moneyDiscount,
              current_discount: line.discount,
              force_list: line.pricesData.force_list,
              force_pricing: line.pricesData.force_pricing
            }
          }
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        applyPromoSingleLine(kwargs, resolve, reject)
      })

      applyCurrencyDiscountPromise.then((data) => {
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        console.log('APPLLYYY CURRENCY', data)
        // CALL THE APPLY PROMO FUNCTION
        _this.applyPromo(cartItems, line.uuid, data, _this.props.client, this.props.config.overrideXMLversion)
      }).catch((err) => {
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        console.log(err)
      })

    } else {
      alertify.alert('ERROR', 'El producto seleccionado no se encuentra agregado.')
    }
  }

  applyForcedPrice() {
    const code = this.props.product.code
    const cartItems = this.props.cart
    const _this = this
    const indexInCart = cartItems.findIndex(cart => cart.product.code == code || cart.product.barcode == code)
    if (indexInCart != -1) {
      const line = cartItems[indexInCart]
      const applyCurrencyDiscountPromise = new Promise((resolve, reject) => {
        const kwargs = {
          url: '/api/products/getProdPrice/',
          data: {
            clientId: _this.props.client.client.id,
            prod_data: {
              code: code,
              qty: line.qty,
              promo_string: line.pricesData.promo_string,
              money_discount: line.pricesData.money_discount,
              current_discount: line.discount,
              force_list: line.pricesData.force_list,
              // THE VARIABLE CHANGED IN THIS METHOD IS THE FORCE PRICING
              force_pricing: _this.props.forcePrice
            }
          }
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        applyPromoSingleLine(kwargs, resolve, reject)
      })

      applyCurrencyDiscountPromise.then((data) => {
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        console.log('APPLLYYY FORCE PRICE', data)
        // CALL THE APPLY PROMO FUNCTION
        // _this.applyPromo(cartItems, line.uuid, data, _this.props.client)
        _this.props.dispatch({type: 'SET_MASS_PRICES_DATA', payload: data})
        this.props.dispatch({type: 'TOGGLE_SINGLE_PRODUCT_PANEL', payload: ''})
        this.props.dispatch({type: 'CLEAR_SINGLE_PRODUCT_QTY', payload: ''})
        this.props.dispatch({type: 'CLEAR_SINGLE_PRODUCT_MONEY_DISCOUNT', payload: ''})
        this.props.dispatch({type: 'CLEAR_SINGLE_PRODUCT_NEW_PRICE', payload: ''})
      }).catch((err) => {
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        console.log(err)
      })

    } else {
      alertify.alert('ERROR', 'El producto seleccionado no se encuentra agregado.')
    }
  }

  applyPromoString(string) {
    console.log('INSIDE STRINGGG')
    const code = this.props.product.code
    const cartItems = this.props.cart
    const _this = this
    const indexInCart = cartItems.findIndex(cart => cart.product.code == code || cart.product.barcode == code)
    if (indexInCart != -1) {
      const line = cartItems[indexInCart]
      const applyCurrencyDiscountPromise = new Promise((resolve, reject) => {
        const kwargs = {
          url: '/api/products/getProdPrice/',
          data: {
            clientId: _this.props.client.client.id,
            prod_data: {
              code: code,
              qty: line.qty,
              promo_string: string,
              money_discount: line.pricesData.money_discount,
              current_discount: line.discount,
              force_list: line.pricesData.force_list,
              // THE VARIABLE CHANGED IN THIS METHOD IS THE FORCE PRICING
              force_pricing: line.pricesData.force_pricing
            }
          }
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        applyPromoSingleLine(kwargs, resolve, reject)
      })

      applyCurrencyDiscountPromise.then((data) => {
        console.log('APPLLYYY CURRENCY', data)
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        // this.props.dispatch(updateItemDiscount(cartItems, line.uuid, data[0].current_discount, data[0].default_discount, _this.props.client, data))
        // CALL THE APPLY PROMO FUNCTION
        _this.applyPromo(cartItems, line.uuid, data, _this.props.client, this.props.config.overrideXMLversion)

      }).catch((err) => {
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        console.log(err)
      })

    } else {
      alertify.alert('ERROR', 'El producto seleccionado no se encuentra agregado.')
    }
  }

  applyPromo(cartItems, uuid, pricesData, client, XMLVersion) {
    this.props.dispatch(updateItemDiscount(cartItems, uuid, pricesData[0].current_discount.toFixed(5), pricesData[0].default_discount, client, pricesData[0], XMLVersion))
    this.props.dispatch({type: 'TOGGLE_SINGLE_PRODUCT_PANEL', payload: ''})
    this.props.dispatch({type: 'CLEAR_SINGLE_PRODUCT_QTY', payload: ''})
    this.props.dispatch({type: 'CLEAR_SINGLE_PRODUCT_MONEY_DISCOUNT', payload: ''})
    this.props.dispatch({type: 'CLEAR_SINGLE_PRODUCT_NEW_PRICE', payload: ''})

  }

  setSingleProductNewPrice(ev) {
    if (ev.key == 'Enter') {
      // EXECUTE CHANGE PRICE ACTION
    } else {
      const val = parseFloat(ev.target.value)
      this.props.dispatch({type: 'SET_SINGLE_PRODUCT_NEW_PRICE', payload: val})
    }
  }

  setSingleProductMoneyDiscount(ev) {
    if (ev.key == 'Enter') {
      // EXECUTE CHANGE PRICE ACTION
    } else {
      const val = parseFloat(ev.target.value)
      this.props.dispatch({type: 'SET_SINGLE_PRODUCT_MONEY_DISCOUNT', payload: val})
    }
  }
  // *******************************************************************
  // Main Layout
  render() {
    const product = this.props.product
    const panelClass = this.props.isVisible ? 'single-product-panel visible' : 'single-product-panel'
    const productStr = this.props.product.code ? `${this.props.product.code} - ${this.props.product.description}` : ''
    const existance = this.props.product.inventory_existent ? (JSON.parse(product.inventory_existent)[this.props.salesWarehouse] || 0) : 0
    const srcCode = ('000000' + this.props.product.code).slice(-6)

    const imageUrl = product.image_name !== '' ? `/media/productImages/${product.image_name}` : `/media/Imagenes/${srcCode}.jpg`

    const priceEditDiv = this.props.config.canEditPricesInSales
      ? <div className='single-product-panel-container-promos-change-price'>
        <h1>Asignar Precio</h1>
        <div className='single-product-panel-container-promos-amount'>
          <input
            type='number'
            className='input'
            value={this.props.forcePrice}
            onChange={this.setSingleProductNewPrice.bind(this)}
            onKeyDown={this.setSingleProductNewPrice.bind(this)}
          />
          <button className='btn btn-primary' onClick={this.applyForcedPrice.bind(this)}>Nuevo Precio</button>
        </div>
      </div>
      : <div />

    // BASED ON PROMO STRING FROM BACKEND GENETRATES BUTTONS
    const promoString = this.props.config.promotionsEnabledCommaSeparated ? this.props.config.promotionsEnabledCommaSeparated : ''
    const promosEnabled = promoString.length ? promoString.split(',') : []
    const promosBtns = promosEnabled.map((promo, index) => {
      const classString = parseFloat(index) % 2 ? 'btn btn-warning secondBtn' : 'btn btn-warning firstBtn'
      return <button key={index} className={classString} onClick={this.applyPromoString.bind(this, promo)}>{promo}</button>
    })
    // GENERATE THE BUTTONS DIV
    const buttonsDiv = promosBtns.length
      ? <div>
        <h1>Aplicar promoción</h1>
        <div className='single-product-panel-container-promos-buttons'>
          {promosBtns}
        </div>
      </div>
      : <div />

    const promoDiv = this.props.config.enablePromotionalDiscounts
      ? <div className='single-product-panel-container-promos'>
        {priceEditDiv}
        <h1>Aplicar descuento en colones</h1>
        <div className='single-product-panel-container-promos-amount'>
          <input
            type='number'
            className='input'
            value={this.props.moneyDiscount}
            onChange={this.setSingleProductMoneyDiscount.bind(this)}
            onKeyDown={this.setSingleProductMoneyDiscount.bind(this)}
          />
          <button className='btn btn-success' onClick={this.applyCurrencyDiscount.bind(this)}>Descuento colones</button>
        </div>
        {buttonsDiv}
      </div>
      : this.props.config.canEditPricesInSales
        ? <div className='single-product-panel-container-promos'>
          {priceEditDiv}
        </div>
        : <div />

    const costRow = this.props.config.showUtilityAndCostOnSales
      ? <tr>
        <th>Costo</th>
        <td>₡{parseFloat(product.cost).toFixed(2) || 'N/A'}</td>
      </tr>
      : <tr />
    const utilityRow = this.props.config.showUtilityAndCostOnSales
      ? <tr>
        <th>Utilidad %</th>
        <td>{product.utility1}</td>
      </tr>
      : <tr />
    return <div className={panelClass}>
      <div className='single-product-panel-header'>
        <span>{productStr}</span>
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='single-product-panel-container'>
        <div className='single-product-panel-container-data'>
          <h1>Datos</h1>
          <div className='single-product-panel-container-data-add'>
            <button className='btn btn-success' onClick={this.addItemToCart.bind(this)}>Agregar</button>
            <input
              type='number'
              className='input'
              value={this.props.qty}
              onChange={this.setSingleProductQty.bind(this)}
              onKeyDown={this.setSingleProductQty.bind(this)}
            />
          </div>
          <table>
            <tbody>
              <tr>
                <th>Código:</th>
                <td>{product.code || 'N/A'}</td>
              </tr>
              <tr>
                <th>Descripción:</th>
                <td>{product.description || 'N/A'}</td>
              </tr>
              <tr>
                <th>Modelo</th>
                <td>{product.model || 'N/A'}</td>
              </tr>
              <tr>
                <th>Código de Proveedor</th>
                <td>{product.supplier_code || 'N/A'}</td>
              </tr>
              <tr>
                <th>Existencia en bodega</th>
                <td>{existance}</td>
              </tr>
              {costRow}
              {utilityRow}
              <tr>
                <th>Precio IVI</th>
                <td>₡{parseFloat(product.sell_price1).toFixed(2) || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {promoDiv}

        <div className='single-product-panel-container-image'>
          <h1>Imagen del Artículo</h1>
          <img src={imageUrl} onError={(e) => { e.target.src = '/media/default/noimage.png' }} />
        </div>
      </div>

    </div>

  }

}
