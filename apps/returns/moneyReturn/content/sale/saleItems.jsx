/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {addToReturn} from '../return/actions.js'

@connect((store) => {
  return {
    sale: store.sale.saleActive
  }
})
export default class CartItems extends React.Component {

  addItem(item) {
    const cart = this.props.cart
    this.props.dispatch(addToReturn(item, item.qty, cart))
  }
  render() {

    const sale = this.props.sale
    const items2 = sale.cart
      ? sale.cart.cartItems.map((item, index) => {

        return <div className='cart-body-item' key={item.product.id} >

          <div className='cart-body-item-code'>
            <h5>Código</h5>
            {item.product.code}
          </div>
          <div className='cart-body-item-description'>
            <h5>Desc</h5>
            {item.product.description}
          </div>
          <div className='cart-body-item-qty'>
            <h5>Cantidad</h5>
            {item.qty}
          </div>
          <div className='cart-body-item-total'>
            <h5>Total</h5>
              ₡ {item.totalWithIv.formatMoney(2, ',', '.')}
          </div>
          <div className='cart-body-item-add'>
            <h5>Agregar</h5>
            <i className='fa fa-chevron-right' onClick={this.addItem.bind(this, item)} />
          </div>

        </div>
      })
      : <div />

    return <div id='cart-body' className='cart-body'>
      {items2}
    </div>

  }

}
