/*
 * Module dependencies
 */
import React from 'react'
import { connect } from 'react-redux'
import { updateTotals, removeFromCart } from './actions'
import { addSubOne, updateItem } from '../product/actions'
import alertify from 'alertifyjs'

const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    inCart: store.purchase_cart.cartItems,
    cartItemActive: store.purchase_cart.cartItemActive,
    discountTotal: store.purchase_cart.discountTotal,
    cartTaxes: store.purchase_cart.cartTaxes,
    is_closed: store.purchase.is_closed,
    orderTransport: store.purchase_cart.orderTransport,
    cartSubtotal: store.purchase_cart.cartSubtotal,
    discount_mode: store.purchase_cart.discount_mode,
    config: store.config.globalConf,
    usesSimpleUtility: store.config.globalConf.usesSimpleUtility
  }
})
export default class CartItems extends React.Component {

  // On component update (The cart has been modified) calls the update totals method in actions file.
  componentDidUpdate(prevProps) {

    this.props.dispatch(updateTotals(this.props.inCart, this.props.cartTaxes, this.props.orderTransport, this.props.discount_mode))

    // Auto Scroll To end of container
    console.log("prev qty --> ", prevProps.inCart.length, this.props.inCart.length)
    if (prevProps.inCart.length < this.props.inCart.length) {
      const elem = document.getElementById('cart-body')
      elem.scrollTop = elem.scrollHeight
    }


  }

  componentWillMount() {

    const _this = this
    Mousetrap.bind('mod+plus', function (e) {

      if (e.preventDefault) {
        e.preventDefault()
      } else {
        // internet explorer
        e.returnValue = false
      }

      _this.props.dispatch(addSubOne(_this.props.cartItemActive, true, _this.props.inCart, _this.props.globalDiscount,
        _this.props.client))
    })

    Mousetrap.bind('mod+f', function (e) {

      if (e.preventDefault) {
        e.preventDefault()
      } else {
        // internet explorer
        e.returnValue = false
      }

      document.getElementById(`qty${_this.props.cartItemActive}`).focus()
    })

    Mousetrap.bind('mod+-', function (e) {
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        // internet explorer
        e.returnValue = false
      }
      _this.props.dispatch(addSubOne(_this.props.cartItemActive, false, _this.props.inCart, _this.props.globalDiscount,
        _this.props.client))
    })

    Mousetrap.bind('mod+*', function (e) {

      if (e.preventDefault) {
        e.preventDefault()
      } else {
        // internet explorer
        e.returnValue = false
      }

      const __this = _this
      alertify.prompt(`Nueva cantidad para el producto seleccionado`, 'Ingrese la nueva cantidad para el producto seleccionado', ''
        , function (evt, value) {
          __this.props.dispatch(updateQtyCode(__this.props.cartItemActive, value, __this.props.inCart,
            __this.props.globalDiscount, __this.props.client))
        }
        , function () { })
        .set('labels', { ok: 'Ok', cancel: 'Cancelar' })
    })
  }

  subTotalChange(code, ev) {
    const subTotal = parseFloat((ev.target.value))
      ? parseFloat(ev.target.value)
      : -1
    if (subTotal == -1) { return }
    const kwargs = {
      id: code,
      is_search_uuid: true,
      itemsInCart: this.props.inCart,
      orderTransport: this.props.orderTransport,
      cartSubtotal: this.props.cartSubtotal,
      discount_mode: this.props.discount_mode,
      // what changed
      subtotal: subTotal,
      XMLVersion: this.props.config.overrideXMLversion,
      usesSimpleUtility: this.props.usesSimpleUtility

    }
    this.props.dispatch(updateItem(kwargs))

  }

  qtyInputChange(code, ev) {
    const qty = parseFloat(ev.target.value)
      ? parseFloat(ev.target.value)
      : -1
    if (qty == -1) { return }
    const kwargs = {
      id: code,
      is_search_uuid: true,
      itemsInCart: this.props.inCart,
      orderTransport: this.props.orderTransport,
      cartSubtotal: this.props.cartSubtotal,
      discount_mode: this.props.discount_mode,
      //what changed
      qty: qty,
      XMLVersion: this.props.config.overrideXMLversion,
      usesSimpleUtility: this.props.usesSimpleUtility
    }
    this.props.dispatch(updateItem(kwargs))
  }

  qtyInputKeyPress(ev) {
    ev.preventDefault()
    if (ev.key == 'Enter') {
      document.getElementById('productCodeInputField').focus()
    }
  }

  target_utility_change(id, e) {

    const tUtility = parseFloat(e.target.value)
      ? parseFloat(e.target.value)
      : -1

    if (tUtility == -1) { return }

    const kwargs = {
      id: id,
      is_search_uuid: true,
      itemsInCart: this.props.inCart,
      orderTransport: this.props.orderTransport,
      cartSubtotal: this.props.cartSubtotal,
      discount_mode: this.props.discount_mode,
      //what changed
      target_utility: tUtility,
      XMLVersion: this.props.config.overrideXMLversion,
      usesSimpleUtility: this.props.usesSimpleUtility
    }
    this.props.dispatch(updateItem(kwargs))
  }

  // HERE UPDATE COST BASED ON DISCOUNT
  discountFieldChange(id, e) {
    // DISCOUNT

    let discount = parseFloat(e.target.value)
      ? parseFloat(e.target.value)
      : 0
    if (this.props.discount_mode == 'percent_based') {
      if (discount > 100) {
        this.props.dispatch({ type: 'LINE_PERCENT_DISCOUNT_OVER_100' })
        discount = 100
      }

      if (discount > 75) {
        this.props.dispatch({ type: 'LINE_DISCOUNT_TOO_HIGH' })
      }
    }
    if (discount == -1) { return }
    const kwargs = {
      id: id,
      is_search_uuid: true,
      itemsInCart: this.props.inCart,
      orderTransport: this.props.orderTransport,
      cartSubtotal: this.props.cartSubtotal,
      discount_mode: this.props.discount_mode,
      // what changed
      discount: discount,
      XMLVersion: this.props.config.overrideXMLversion,
      usesSimpleUtility: this.props.usesSimpleUtility
    }
    this.props.dispatch(updateItem(kwargs))
  }
  // HERE UPDATE COST BASED ON DISCOUNT AND APPLY TO CLIENT
  applyToClientFieldChange(id, e) {
    // TO CLIENT
    const apply = e.target.checked
    const kwargs = {
      id: id,
      is_search_uuid: true,
      itemsInCart: this.props.inCart,
      orderTransport: this.props.orderTransport,
      cartSubtotal: this.props.cartSubtotal,
      discount_mode: this.props.discount_mode,
      //what changed
      applyToClient: apply,
      XMLVersion: this.props.config.overrideXMLversion,
      usesSimpleUtility: this.props.usesSimpleUtility
    }
    this.props.dispatch(updateItem(kwargs))

  }

  setCartItemActive(code, ev) {
    this.props.dispatch({ type: 'SET_PRODUCT_ACTIVE_IN_CART', payload: code })
  }

  removeItem(code, ev) {
    this.props.dispatch(removeFromCart(this.props.inCart, code))
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  // Render the items in cart using table rows

  render() {

    const cartItems2 = this.props.inCart
    const items2 = cartItems2.map((item, index) => {

      const activeClass = (item.product.code == this.props.cartItemActive || item.product.barcode == this.props.cartItemActive)
        ? 'purchase-cart-activeRow cart-body-item'
        : 'purchase-cart-body-item'

      const removeIconClass = this.props.disabled ? 'removeItemIcon disabled' : 'removeItemIcon'

      const qtyField = <input
        id={`qty${item.product.code}`}
        disabled={this.props.is_closed}
        onChange={this.qtyInputChange.bind(this, item.uuid)}
        onFocus={this.fieldFocus.bind(this)}
        onKeyUp={this.qtyInputKeyPress.bind(this)}
        type='number'
        className='form-control'
        value={item.qty}
      />

      const subTotalField = <input
        id={`sub${item.product.code}`}
        disabled={this.props.is_closed}
        onChange={this.subTotalChange.bind(this, item.uuid)}
        className='form-control'
        value={item.subtotal}
        type="number" />

      const discountField = <input
        id={`tu${item.product.code}`}
        disabled={this.props.is_closed}
        onChange={this.discountFieldChange.bind(this, item.uuid)}
        type='number'
        className='form-control'
        value={item.discount}
      />

      const discountToClientCheckbox = <input
        id={`tu${item.product.code}`}
        disabled={this.props.is_closed}
        onChange={this.applyToClientFieldChange.bind(this, item.uuid)}
        type='checkbox'
        className='form-control'
        checked={item.applyToClient}
      />

      return <div className={activeClass}
        key={item.uuid}
        onClick={this.setCartItemActive.bind(this, item.product.code)}
      >
        <div className='purchase-cart-body-item-code'>
          <h5>Código</h5>
          {item.product.code}
        </div>
        <div className='purchase-cart-body-item-description'>
          <h5>Desc</h5>
          {item.product.description}
        </div>
        <div className='purchase-cart-body-item-qty'>
          <h5>Cantidad</h5>
          {qtyField}
        </div>
        <div className='purchase-cart-body-item-cost'>
          <h5>Costo</h5>
          {(item.cost ? item.cost : item.subtotal / item.qty).toFixed(2)}
        </div>
        <div className='purchase-cart-body-item-discount'>
          <h5>Descuento</h5>
          {discountField}
        </div>
        <div className='purchase-cart-body-item-discountToClient'>
          <h5>A Cliente</h5>
          {discountToClientCheckbox}
        </div>
        <div className='purchase-cart-body-item-total'>
          <h5>Total</h5>
          {subTotalField}
        </div>
        <span className={removeIconClass}>

          {this.props.is_closed ? '' : <i onClick={this.removeItem.bind(this, item.uuid)} className='fa fa-times-circle' />}

        </span>

      </div>
    })

    return <div id='cart-body' className='purchase-cart-body'>
      {items2}
    </div>

  }

}
