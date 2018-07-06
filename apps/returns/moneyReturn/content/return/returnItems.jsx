/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {removeFromReturn, updateTotals, updateQty} from '../return/actions.js'

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

  qtyInputChange(code, ev) {

    const qty = parseFloat((ev.target.value))
      ? ev.target.value
      : 0
    this.props.dispatch(updateQty(code, qty, this.props.returnCartItems))

  }

  fieldFocus(ev) {
    ev.target.select()
  }

  removeItem(uuid) {
    this.props.dispatch(removeFromReturn(this.props.returnCartItems, uuid))
  }
  render() {

    const items = this.props.returnCartItems
      ? this.props.returnCartItems.map((item, index) => {

        const qtyField = <input
          id={`qty${item.originalItem.product.code}`}
          // disabled={this.props.disabled || this.props.presaleLoaded}
          onChange={this.qtyInputChange.bind(this, item.uuid)}
          onFocus={this.fieldFocus.bind(this)}
          type='number'
          className='form-control'
          value={item.qty}
        />

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
            {qtyField}
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
