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

  componentWillMount () {
    this.props.dispatch({type: 'CLEAR_CHECK_TAKE_MOVEMENTS_CART', payload: ''})
    this.props.dispatch({type: 'CLEAR_CHECK_TAKE_PRODUCT_MOVEMENTS', payload: ''})
    this.props.dispatch({type: 'CLEAR_CHECK_TAKE_PRODUCT_ACTIVE', payload: ''})
  }

  // Main Layout
  render() {

    return <div className='check-take-movements-content-cart'>
      <div className='cart'>
        <div className='cart-header'>
          <div className='cart-header-code'>
            <h5>Cons</h5>
          </div>
          <div className='cart-header-description'>
            <h5>Art</h5>
          </div>
          <div className='cart-header-date'>
            <h5>Creado</h5>
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
