/*
 * Module dependencies
 */
import React from 'react'

import Product from '../../../sales/general/product/product.jsx'
import Cart from '../../../sales/general/cart/cart.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.order.fullWidth,
    total: store.cart.cartTotal
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'order-content fullWidth' : 'order-content'
    const cartClass = this.props.fullWidth ? 'order-content-cart' : 'order-content-cart fullHeight'
    const totalClass = this.props.fullWidth ? 'order-content-total' : 'order-content-total collapsed'

    return <div className={contentClass}>
      <div className='order-content-product' >
        <Product />
      </div>
      <div className={cartClass} >
        <Cart caller='orders' />
      </div>
      <div className={totalClass} >
        ₡ {this.props.total.formatMoney()}
        <i className='fa fa-chevron-left' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>

  }

}
