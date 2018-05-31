/*
 * Module dependencies
 */
import React from 'react'

import Product from '../../general/product/product.jsx'
import Cart from '../../general/cart/cart.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.presale.fullWidth,
    total: store.cart.cartTotal
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'sale-content fullWidth' : 'sale-content'
    const cartClass = this.props.fullWidth ? 'sale-content-cart' : 'sale-content-cart fullHeight'
    const totalClass = this.props.fullWidth ? 'sale-content-total' : 'sale-content-total collapsed'

    return <div className={contentClass}>
      <div className='sale-content-product' >
        <Product />
      </div>
      <div className={cartClass} >
        <Cart />
      </div>
      <div className={totalClass} >
        ₡ {this.props.total.formatMoney()}
        <i className='fa fa-chevron-left' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>

  }

}
