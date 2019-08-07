/*
 * Module dependencies
 */
import React from 'react'

import Product from '../../../../../../sales/general/product/product.jsx'
import Cart from '../../../../../../sales/general/cart/cart.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.selfpurchase.fullWidth,
    total: store.cart.cartTotal
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'selfpurchase-content fullWidth' : 'selfpurchase-content'
    const cartClass = this.props.fullWidth ? 'selfpurchase-content-cart' : 'selfpurchase-content-cart fullHeight'
    const totalClass = this.props.fullWidth ? 'selfpurchase-content-total' : 'selfpurchase-content-total collapsed'

    return <div className={contentClass}>
      <div className='selfpurchase-content-product' >
        <Product key='SelfPurchase' />
      </div>
      <div className={cartClass} >
        <Cart caller='selfpurchases' key='SelfPurchase' />
      </div>
      <div className={totalClass} >
        ₡ {this.props.total.formatMoney()}
        <i className='fa fa-chevron-left' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>

  }

}
