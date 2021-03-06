/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {productSelected, setProductNew} from '../../sales/general/product/actions.js'

@connect((store) => {
  return {
    isVisible: store.products2.singleProductVisible,
    product: store.products2.sigleProductActive,
    salesWarehouse: store.userProfile.salesWarehouse,
    qty: store.products.singleProductQty,
    client: store.clients.clientSelected,
    itemsInCart: store.cart.cartItems,
    globalDiscount: store.cart.globalDiscount,
    warehouse_id: store.userProfile.salesWarehouse,
    config: store.config.globalConf,
    priceListSelected: store.priceList.listSelected,
    usePriceListAsDefault: store.priceList.useAsDefault
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
            code: code,
            ignorePerLocals: this.props.ignorePerLocals ? this.props.ignorePerLocals : false
          },
          clientId: _this.props.client.client.id
        }
      }

      _this.props.dispatch({type: 'FETCHING_STARTED'})
      setProductNew(kwargs, resolve, reject)
    }).catch(err => {
      console.log("HERE FACK --> ", err)
    })

    setProductPromiseNew.then((data) => {

      _this.props.dispatch({type: 'FETCHING_DONE'})
      const product = data[0].product
      if (product.code == '00') {
        _this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
        _this.props.dispatch({type: 'SHOW_GENERAL_ITEM_PANEL'})
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
      _this.props.dispatch({type: 'FETCHING_DONE'})
      console.log(err)
    })
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

    return <div className={panelClass}>
      <div className='single-product-panel-header'>
        <span>{productStr}</span>
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='single-product-panel-add'>
        <button className='btn btn-success' onClick={this.addItemToCart.bind(this)} >Agregar</button>
        <input
          type='number'
          className='input'
          value={this.props.qty}
          onChange={this.setSingleProductQty.bind(this)}
          onKeyDown={this.setSingleProductQty.bind(this)}
        />
      </div>
      <div className='single-product-panel-content'>
        <div className='single-product-panel-content-data'>
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
                <th>Número de parte</th>
                <td>{product.part_number || 'N/A'}</td>
              </tr>
              <tr>
                <th>Código de marca</th>
                <td>{product.brand_code || 'N/A'}</td>
              </tr>
              <tr>
                <th>Existencia en bodega</th>
                <td>{existance}</td>
              </tr>
              <tr>
                <th>Precio IVI</th>
                <td>₡{parseFloat(product.sell_price).toFixed(2) || 'N/A'}</td>
              </tr>
            </tbody>

          </table>
        </div>
        <div className='single-product-panel-content-image'>
          <h1>Imágen del Artículo</h1>
          <img src={imageUrl} onError={(e) => { e.target.src = '/media/default/noimage.png' }} />
        </div>
      </div>
    </div>

  }

}
