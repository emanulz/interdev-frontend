/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    cart: store.takeMovements.cart
  }
})
export default class CartItems extends React.Component {

  // Main Layout
  render() {
    console.log('CART--->', this.props.cart)
    const items = this.props.cart.map(item => {

      const qtyField = <input
        id={`qty${item.product.code}`}
        type='number'
        className='form-control'
        value={item.qty}
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
          <i className='fa fa-times-circle' />
        </span>

      </div>
    })

    return <div id='cart-body' className='cart-body'>
      {items}
    </div>
  }
}
