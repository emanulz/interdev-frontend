/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import CartItems from './cartItems.jsx'
@connect((store) => {
  return {
  }
})
export default class Cart extends React.Component {

  // Main Layout
  render() {

    return <div className='take-movements-content-cart'>
      <div className='cart'>
        <div className='cart-header'>
          <div className='cart-header-code'>
            <h5>Cód</h5>
          </div>
          <div className='cart-header-description'>
            <h5>Art</h5>
          </div>
          <div className='cart-header-qty'>
            <h5>Cant</h5>
          </div>
        </div>
        <CartItems />
      </div>

    </div>
  }
}
