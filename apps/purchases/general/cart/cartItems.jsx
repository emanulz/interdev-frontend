/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {updateTotals, removeFromCart} from './actions'
import {addSubOne, updateItem} from '../product/actions'
import alertify from 'alertifyjs'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    inCart: store.cart.cartItems,
    cartItemActive: store.cart.cartItemActive,
    discountTotal: store.cart.discountTotal,
    cartTaxes: store.cart.cartTaxes,
  }
})
export default class CartItems extends React.Component {

  // On component update (The cart has been modified) calls the update totals method in actions file.
  componentDidUpdate(prevProps) {

    this.props.dispatch(updateTotals(this.props.inCart, this.props.discountTotal, this.props.cartTaxes))

    // Auto Scroll To end of container
    const elem = document.getElementById('cart-body')
    elem.scrollTop = elem.scrollHeight

  }

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
        _this.props.client))
    })

    Mousetrap.bind('mod+f', function(e) {

      if (e.preventDefault) {
        e.preventDefault()
      } else {
      // internet explorer
        e.returnValue = false
      }

      document.getElementById(`qty${_this.props.cartItemActive}`).focus()
    })

    Mousetrap.bind('mod+-', function(e) {
      if (e.preventDefault) {
        e.preventDefault()
      } else {
      // internet explorer
        e.returnValue = false
      }
      _this.props.dispatch(addSubOne(_this.props.cartItemActive, false, _this.props.inCart, _this.props.globalDiscount,
        _this.props.client))
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
            __this.props.globalDiscount, __this.props.client))
        }
        , function() {})
        .set('labels', {ok: 'Ok', cancel: 'Cancelar'})
    })
  }

  subTotalChange(code, ev){
    const subTotal = parseFloat((ev.target.value))
    ? parseFloat(ev.target.value)
    : -1
    if(subTotal==-1){return}
    this.props.dispatch(updateItem(code, true, this.props.inCart, -1, subTotal))

  }

  qtyInputChange(code, ev){
    const qty = parseFloat(ev.target.value)
    ? parseFloat(ev.target.value)
    : -1
    if(qty==-1){return}
    this.props.dispatch(updateItem(code, true, this.props.inCart, qty, -1))
  }

  qtyInputKeyPress(ev) {
    ev.preventDefault()
    if (ev.key == 'Enter') {
      document.getElementById('productCodeInputField').focus()
    }
  }

  setCartItemActive(code, ev) {
    this.props.dispatch({type: 'SET_PRODUCT_ACTIVE_IN_CART', payload: code})
  }

  removeItem(code, ev) {
    this.props.dispatch(removeFromCart(this.props.inCart, code))
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  // Render the items in cart using table rows

  render() {

    const cartItems = this.props.inCart
    const items2 = cartItems.map((item, index) => {

      const activeClass = (item.product.code == this.props.cartItemActive || item.product.barcode == this.props.cartItemActive)
        ? 'cart-activeRow cart-body-item'
        : 'cart-body-item'

      const removeIconClass = this.props.disabled ? 'removeItemIcon disabled' : 'removeItemIcon'

      const taxes1 = (item.product.use_taxes)
        ? item.product.taxes
        : 0

      const qtyField = <input
        id={`qty${item.product.code}`}
        disabled={this.props.disabled}
        onChange={this.qtyInputChange.bind(this, item.uuid)}
        onFocus={this.fieldFocus.bind(this)}
        onKeyUp={this.qtyInputKeyPress.bind(this)}
        type='number'
        className='form-control'
        value={item.qty}
      />

      const subTotalField = <input 
        id={`sub${item.product.code}`}
        onChange={this.subTotalChange.bind(this, item.uuid)}
        className='form-control'
        value={item.subtotal}
        type="number"/>

      /*const discountField = this.props.client.saleLoaded
        ? <input
          disabled={this.props.disabled}
          onKeyPress={this.discountInputKeyPress.bind(this, item.uuid)}
          onBlur={this.discountInputOnBlur.bind(this, item.uuid)}
          onFocus={this.fieldFocus.bind(this)}
          type='number' className='form-control'
          defaultValue={parseFloat(item.discount)}
        />
        : <input
          disabled={this.props.disabled}
          onKeyPress={this.discountInputKeyPress.bind(this, item.uuid)}
          onBlur={this.discountInputOnBlur.bind(this, item.uuid)}
          onFocus={this.fieldFocus.bind(this)}
          type='number' className='form-control'
        />*/

      return <div className={activeClass}
        key={item.uuid}
        onClick={this.setCartItemActive.bind(this, item.product.code)}>

        <div className='cart-body-item-code'>
          <h5>Código</h5>
          {item.product.code}
        </div>
        <div className='cart-body-item-description'>
          <h5>Desc</h5>
          {item.product.description}
        </div>
        <div className='cart-body-item-qty'>
          <h5>Cantidad</h5>
          {qtyField}
        </div>
        <div className='cart-body-item-total'>
          <h5>Total</h5>
            {subTotalField}
        </div>
        <span className={removeIconClass}>
          <i onClick={this.removeItem.bind(this, item.uuid)} className='fa fa-times-circle' />
        </span>

      </div>
    })

    return <div id='cart-body' className='cart-body'>
      {items2}
    </div>

  }

}
