/*
 * Module dependencies
 */
import React from 'react'

import Product from '../../../sales/general/product/product.jsx'
import Cart from '../../../sales/general/cart/cart.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.request.fullWidth,
    total: store.cart.cartTotal
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'request-content fullWidth' : 'request-content'
    const cartClass = this.props.fullWidth ? 'request-content-cart' : 'request-content-cart fullHeight'
    const totalClass = this.props.fullWidth ? 'request-content-total' : 'request-content-total collapsed'

    return <div className={contentClass}>
      <div className='request-content-product' >
        <Product key='Request' />
      </div>
      <div className={cartClass} >
        <Cart caller='requests' key='Request' />
      </div>
      <div className={totalClass} >
        ₡ {this.props.total.formatMoney()}
        <i className='fa fa-chevron-left' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>

  }

}
