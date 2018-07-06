/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import Sale from './sale/sale.jsx'
import Return from './return/return.jsx'

@connect((store) => {
  return {
    fullWidth: store.moneyReturn.fullWidth,
    sale: store.sale.saleActive,
    returnCart: store.returnCart
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'moneyReturn-content' : 'moneyReturn-content blured'
    const sale = this.props.sale
    const saleTotal = sale.cart
      ? sale.cart.cartTotal : 0
    const returnTotal = this.props.returnCart
      ? this.props.returnCart.returnTotal : 0
    return <div className={contentClass}>
      <div className='moneyReturn-content-sale' >
        <div className='moneyReturn-content-sale-header'>
          VENTA REGISTRADA
        </div>
        <div className='moneyReturn-content-sale-content'>
          <Sale />
        </div>
        <div className='moneyReturn-content-sale-footer'>
        ₡ {parseFloat(saleTotal).formatMoney()}
        </div>
      </div>
      <div className='moneyReturn-content-return' >
        <div className='moneyReturn-content-return-header'>
          DEVOLUCIÓN
          <i className='fa fa-chevron-left' onClick={this.toggleWidth.bind(this)} />
        </div>
        <div className='moneyReturn-content-return-content'>
          <Return />
        </div>
        <div className='moneyReturn-content-return-footer'>
          ₡ {parseFloat(returnTotal).formatMoney()}
        </div>
      </div>
    </div>

  }

}
