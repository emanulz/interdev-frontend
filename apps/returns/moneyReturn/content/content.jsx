/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import Sale from './sale/sale.jsx'
import Return from './return/return.jsx'
import {addToReturn, getAlreadyReturnedQty} from './return/actions.js'

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

  setInvoiceNull () {
    this.props.dispatch({type: 'CLEAR_RETURN_ITEMS', payload: ''})
    console.log(this.props.sale.cart.cartItems)
    for (let i = 0; i < this.props.sale.cart.cartItems.length; i++) {
      this.addItem(this.props.sale.cart.cartItems[i])
    }
  }

  addItem(item) {
    const alreadyReturned = getAlreadyReturnedQty(item, this.props.sale)
    const qty = parseFloat(item.qty) - alreadyReturned
    if (qty > 0) {
      this.props.dispatch(addToReturn(item, qty, alreadyReturned))
    }
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
          VENTA# {sale.consecutive}
          <span onClick={this.setInvoiceNull.bind(this)}>
            Anular
            <i className='fa fa-trash' />
          </span>
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
          <span onClick={this.toggleWidth.bind(this)}>
            Guardar
            <i className='fa fa-save' />
          </span>
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
