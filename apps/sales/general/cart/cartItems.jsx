/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {updateTotals, removeFromCart} from './actions'
import {updateItemDiscount, updateItemLote, updateQty, addSubOne, updateQtyCode, recalcCart} from '../product/actions'
import alertify from 'alertifyjs'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    inCart: store.cart.cartItems,
    client: store.clients.clientSelected,
    globalDiscount: store.cart.globalDiscount,
    disabled: store.completed.completed,
    cartItemActive: store.cart.cartItemActive,
    warehouse_id: store.userProfile.salesWarehouse,
    presaleLoaded: store.completed.isPresaleLoaded,
    reserveLoaded: store.completed.isReserveLoaded,
    reinvoiceLoaded: store.completed.isReinvoiceLoaded,
    isExempt: store.cart.isExempt,
    config: store.config.globalConf,
    currencySymbol: store.currency.symbolSelected,
    pricesDetails: store.products.pricesDetails,
    needsRecalc: store.cart.needsRecalc,
    listSelected: store.priceList.listSelected,
    useListAsDefault: store.priceList.useAsDefault
    // defaultConfig: store.config.defaultSales,
    // userConfig: store.config.userSales
  }
})
export default class CartItems extends React.Component {

  constructor(props) {
    super(props)
    this.state = {qtyField: ''}
  }

  // On component update (The cart has been modified) calls the update totals method in actions file.
  componentDidUpdate(prevProps) {

    this.props.dispatch(updateTotals(this.props.inCart, this.props.isExempt, this.props.config.dontRoundInSales, this.props.config.overrideXMLversion, this.props.config.usesNewExemptionProcess))

    // Auto Scroll To end of container
    // const elem = document.getElementById('cart-body')
    // elem.scrollTop = elem.scrollHeight
    // console.log('PREV CART LENNNN', prevProps.inCart.length)
    // console.log('CART LENNNN', this.props.inCart.length)
    const prevLength = prevProps.inCart.length
    const currentlength = this.props.inCart.length
    if (currentlength > prevLength) {
      // Auto Scroll To end of container
      const elem = document.getElementById('cart-body')
      elem.scrollTop = elem.scrollHeight
    }
    if (this.props.needsRecalc) {
      // alert('NEEDS RECALCCCCC')
      this.props.dispatch({type: 'SET_CART_NEEDS_RECALC', payload: false})
      this.props.dispatch(recalcCart(this.props.inCart, [], this.props.listSelected, this.props.useListAsDefault, true, this.props.config.overrideXMLversion))
    }

  }

  // componentDidUpdate(nextProps) {
  //   if (this.props.cartItemActive != nextProps.cartItemActive) {
  //     console.log(document.getElementById(`qty${nextProps.cartItemActive}`))
  //   }
  // }

  componentWillMount() {

    const _this = this
    Mousetrap.bind('mod+plus', function(e) {

      if (e.preventDefault) {
        e.preventDefault()
      } else {
      // internet explorer
        e.returnValue = false
      }

      _this.props.dispatch(addSubOne(_this.props.cartItemActive, true, _this.props.inCart, _this.props.globalDiscount,
        _this.props.client, _this.props.warehouse_id, _this.props.config.overrideXMLversion))
    })

    // Mousetrap.bind('mod+f', function(e) {

    //   if (e.preventDefault) {
    //     e.preventDefault()
    //   } else {
    //   // internet explorer
    //     e.returnValue = false
    //   }

    //   document.getElementById(`qty${_this.props.cartItemActive}`).focus()
    // })

    Mousetrap.bind('mod+-', function(e) {
      if (e.preventDefault) {
        e.preventDefault()
      } else {
      // internet explorer
        e.returnValue = false
      }
      _this.props.dispatch(addSubOne(_this.props.cartItemActive, false, _this.props.inCart, _this.props.globalDiscount,
        _this.props.client, _this.props.warehouse_id, _this.props.config.overrideXMLversion))
    })

    Mousetrap.bind('mod+*', function(e) {

      if (e.preventDefault) {
        e.preventDefault()
      } else {
      // internet explorer
        e.returnValue = false
      }

      const __this = _this
      alertify.prompt(`Nueva cantidad para el producto seleccionado`, 'Ingrese la nueva cantidad para el producto seleccionado', ''
        , function(evt, value) {
          __this.props.dispatch(updateQtyCode(__this.props.cartItemActive, value, __this.props.inCart,
            __this.props.globalDiscount, __this.props.client, __this.props.warehouse_id, _this.props.config.overrideXMLversion, _this.props.dontCheckInv))
        }
        , function() {})
        .set('labels', {ok: 'Ok', cancel: 'Cancelar'})
    })
  }

  discountInputKeyPress(code, ev) {
    console.log('EVVV TAR', ev.target)
    const discount = (ev.target.value)
      ? ev.target.value
      : 0
    this.props.dispatch(updateItemDiscount(this.props.inCart, code, discount, this.props.globalDiscount,
      this.props.client, false, this.props.config.overrideXMLversion))

    if (ev.key == 'Enter') {
      ev.preventDefault()
      const discount = (ev.target.value)
        ? ev.target.value
        : 0
      this.props.dispatch(updateItemDiscount(this.props.inCart, code, discount, this.props.globalDiscount,
        this.props.client, false, this.props.config.overrideXMLversion))

    }

  }

  discountInputOnBlur(code, ev) {

    const discount = (ev.target.value)
      ? ev.target.value
      : 0
    this.props.dispatch(updateItemDiscount(this.props.inCart, code, discount, this.props.globalDiscount,
      this.props.client, false, this.props.config.overrideXMLversion))

  }

  qtyInputChange(code, ev) {
    console.log(ev.target.value)
    const qty = ev.target.value
      ? parseFloat(ev.target.value)
      : -1
    // this.state.qtyField = qty
    if (qty == -1) { return }
    this.props.dispatch(updateQty(
      code, qty, this.props.inCart, this.props.globalDiscount,
      this.props.client, this.props.warehouse_id,
      this.props.config.overrideXMLversion,
      this.props.dontCheckInv
    ))

  }

  // qtyInputKeyPress(ev) {
  //   ev.preventDefault()
  //   console.log('called')
  //   if (ev.key == 'Enter') {
  //     console.log('Presssss', ev.key)
  //     document.getElementById('productCodeInputField').focus()
  //   }
  // }

  loteInputKeyPress(code, ev) {

    if (ev.key == 'Enter') {
      ev.preventDefault()
      const lote = (ev.target.value)
        ? ev.target.value
        : 0
      this.props.dispatch(updateItemLote(this.props.inCart, code, lote))

    }

  }

  loteInputOnBlur(code, ev) {

    const lote = (ev.target.value)
      ? ev.target.value
      : 0
    this.props.dispatch(updateItemLote(this.props.inCart, code, lote))

  }

  setCartItemActive(code, ev) {

    this.props.dispatch({type: 'SET_PRODUCT_ACTIVE_IN_CART', payload: code})

  }

  removeItem(code, ev) {

    this.props.dispatch(removeFromCart(this.props.inCart, code))
    document.getElementById('productCodeInputField').focus()
    document.getElementById('productCodeInputField').value = ''

  }

  fieldFocus(ev) {
    ev.target.select()
    try {
      ev.target.setSelectionRange(0, 9999)
    } catch (err) {}
  }

  showProductPanel(product, ev) {
    this.props.dispatch({type: 'SET_SINGLE_PRODUCT_ACTIVE', payload: product})
    this.props.dispatch({type: 'TOGGLE_SINGLE_PRODUCT_PANEL', payload: product})
  }

  // Render the items in cart using table rows

  render() {
    const symbol = this.props.currencySymbol

    const cartItems = this.props.inCart
    const items2 = cartItems.map((item, index) => {

      const activeClass = (item.product.code == this.props.cartItemActive || item.product.barcode == this.props.cartItemActive)
        ? 'cart-activeRow cart-body-item'
        : 'cart-body-item'

      const removeIconClass = this.props.disabled || (this.props.presaleLoaded && !this.props.config.canEditPresales && !this.props.reinvoiceLoaded) ? 'removeItemIcon disabled' : 'removeItemIcon'

      const taxes1 = (item.product.use_taxes)
        ? item.product.taxes
        : 0

      const taxesIVA = (parseFloat(item.product.taxes_IVA) > 0)
        ? item.product.taxes_IVA
        : 0
      const XMLVersion = this.props.config.overrideXMLversion
      let taxesToUse = 0
      // PREVIOUS VERSIONS USES OLD CODE
      if (XMLVersion == '4.2' || XMLVersion == '') {
        taxesToUse = taxes1
      // XML 4.3
      } else if (XMLVersion == '4.3') {
        taxesToUse = taxesIVA
      // NOT FOUND
      } else {
        alertify.alert('ERROR', `No se pudo leer la version activa del formato XML, en el producto ${item.product.description}, se mostrará CERO, lo que puede ser un valor erroneo.`)
      }

      const qtyField = <input
        id={`qty${item.product.code}`}
        disabled={this.props.disabled || (this.props.presaleLoaded && !this.props.config.canEditPresales && !this.props.reinvoiceLoaded) || this.props.reserveLoaded}
        onChange={this.qtyInputChange.bind(this, item.uuid)}
        onFocus={this.fieldFocus.bind(this)}
        // onKeyUp={this.qtyInputKeyPress.bind(this)}
        type='number'
        className='form-control'
        value={item.qty}
      />

      const discountField = this.props.client.saleLoaded
        ? <input
          disabled={this.props.disabled || (this.props.presaleLoaded && !this.props.config.canEditPresales && !this.props.reinvoiceLoaded)}
          onChange={this.discountInputKeyPress.bind(this, item.uuid)}
          onBlur={this.discountInputOnBlur.bind(this, item.uuid)}
          onFocus={this.fieldFocus.bind(this)}
          type='number' className='form-control'
          defaultValue={item.discount}
        />
        : <input
          disabled={this.props.disabled || (this.props.presaleLoaded && !this.props.config.canEditPresales && !this.props.reinvoiceLoaded)}
          onChange={this.discountInputKeyPress.bind(this, item.uuid)}
          onBlur={this.discountInputOnBlur.bind(this, item.uuid)}
          onFocus={this.fieldFocus.bind(this)}
          type='number' className='form-control'
          value={item.discount}
        />
      const fields = this.props.caller == 'requests'
        ? <div className={activeClass}
          key={item.uuid}
          onClick={this.setCartItemActive.bind(this, item.product.code)}>

          <div className='cart-body-item-requests-code' onDoubleClick={this.showProductPanel.bind(this, item.product)}>
            <h5>Código</h5>
            {item.product.code}
          </div>
          <div className='cart-body-item-requests-description' onDoubleClick={this.showProductPanel.bind(this, item.product)}>
            <h5>Desc</h5>
            {item.product.description}
          </div>
          <div className='cart-body-item-requests-qty'>
            <h5>Cantidad</h5>
            {qtyField}
          </div>
          <span className={removeIconClass}>
            <i onClick={this.removeItem.bind(this, item.uuid)} className='fa fa-times-circle' />
          </span>
        </div>
        : <div className={activeClass}
          key={item.uuid}
          onClick={this.setCartItemActive.bind(this, item.product.code)}>

          <div className='cart-body-item-code' onDoubleClick={this.showProductPanel.bind(this, item.product)}>
            <h5>Código</h5>
            {item.product.code}
          </div>
          <div className='cart-body-item-description' onDoubleClick={this.showProductPanel.bind(this, item.product)}>
            <h5>Desc</h5>
            {item.product.description}
          </div>
          <div className='cart-body-item-qty'>
            <h5>Cantidad</h5>
            {qtyField}
          </div>
          <div className='cart-body-item-unitPrice'>
            <h5>P Unit</h5>
            {symbol} {parseFloat(item.priceToUse).formatMoney(2, ',', '.')}
          </div>
          <div className='cart-body-item-discount'>
            <h5>Descuento</h5>
            {discountField}
          </div>
          <div className='cart-body-item-iva'>
            <h5>IV</h5>
            {taxesToUse}
          </div>
          <div className='cart-body-item-total'>
            <h5>Total</h5>
            {symbol} {item.totalWithIv ? item.totalWithIv.formatMoney(2, ',', '.') : 0}
          </div>
          <span className={removeIconClass}>
            <i onClick={this.removeItem.bind(this, item.uuid)} className='fa fa-times-circle' />
          </span>
        </div>
      return fields
    })

    // return <tbody className='table-body'>
    //   {items}
    // </tbody>

    return <div id='cart-body' className='cart-body'>
      {items2}
    </div>

  }

}
