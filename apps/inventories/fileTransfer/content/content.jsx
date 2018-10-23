import React from 'react'
import {connect} from 'react-redux'


import Product from '../../../sales/general/product/product.jsx'
import Cart from '../../../sales/general/cart/cart.jsx'


@connect(store=>{
    return {
      fullWidth: store.fileTransfer.fullWidth,
      total: store.cart.cartTotal
    }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }
  render(){
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