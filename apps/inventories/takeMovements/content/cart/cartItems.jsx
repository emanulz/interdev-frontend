/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {removeFromCart, updateQty} from './actions.js'

@connect((store) => {
  return {
    cart: store.takeMovements.cart
  }
})

export default class CartItems extends React.Component {

  removeItem(code, ev) {

    this.props.dispatch(removeFromCart(this.props.cart, code))

  }

  qtyInputChange(code, ev) {

    const qty = parseFloat((ev.target.value))
      ? ev.target.value
      : 0
    this.props.dispatch(updateQty(this.props.cart, code, qty))

  }

  fieldFocus(ev) {
    ev.target.select()
  }

  // Main Layout
  render() {
    const items = this.props.cart.map(item => {

      const qtyField = <input
        id={`qty${item.product.code}`}
        type='number'
        className='form-control'
        value={item.qty}
        onChange={this.qtyInputChange.bind(this, item.uuid)}
        onFocus={this.fieldFocus.bind(this)}
      />

      return <div className='cart-body-item' key={item.uuid}>
        <div className='cart-body-item-code'>
          {item.product.code}
        </div>
        <div className='cart-body-item-description'>
          {item.product.description}
        </div>
        <div className='cart-body-item-qty'>
          {qtyField}
        </div>

        <span className='removeItemIcon'>
          <i onClick={this.removeItem.bind(this, item.uuid)} className='fa fa-times-circle' />
        </span>

      </div>
    })

    return <div id='cart-body' className='cart-body'>
      {items}
    </div>
  }
}
