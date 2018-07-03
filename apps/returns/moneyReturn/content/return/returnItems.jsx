/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {removeFromReturn, updateTotals} from '../return/actions.js'

@connect((store) => {
  return {
    returnCartItems: store.returnCart.returnItems
  }
})
export default class CartItems extends React.Component {

  // On component update (The cart has been modified) calls the update totals method in actions file.
  componentDidUpdate(prevProps) {

    this.props.dispatch(updateTotals(this.props.returnCartItems))

    // Auto Scroll To end of container
    const elem = document.getElementById('cart-return-body')
    elem.scrollTop = elem.scrollHeight

  }

  removeItem(uuid) {
    this.props.dispatch(removeFromReturn(this.props.returnCartItems, uuid))
  }
  render() {

    const items = this.props.returnCartItems
      ? this.props.returnCartItems.map((item, index) => {

        return <div className='cart-body-item' key={item.originalItem.product.id} >

          <div className='cart-body-item-code'>
            <h5>Código</h5>
            {item.originalItem.product.code}
          </div>
          <div className='cart-body-item-description'>
            <h5>Desc</h5>
            {item.originalItem.product.description}
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
            <h5>Remover</h5>
            <i className='fa fa-close' onClick={this.removeItem.bind(this, item.uuid)} />
          </div>

        </div>
      })
      : <div />

    return <div id='cart-return-body' className='cart-body'>
      {items}
    </div>

  }

}
