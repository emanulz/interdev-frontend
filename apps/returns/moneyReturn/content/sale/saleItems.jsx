/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {addToReturn, getAlreadyReturnedQty} from '../return/actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    sale: store.sale.saleActive,
    returnItems: store.returnCart.returnItems,
    noInv: store.sale.noInvAfected
  }
})
export default class CartItems extends React.Component {

  addItem(item, alreadyIncart) {
    if (alreadyIncart) {
      alertify.alert('ERROR', `Usted está intentando agregar un elemento que ya fue agregado modificando los atributos,
                               por favor no intente modificar la página, un EMAIL ha sido enviado a los desarrolladores con el usuario que intenta realizar la acción`)
      return false
    }
    const alreadyReturned = getAlreadyReturnedQty(item, this.props.sale, this.props.noInv)
    let qty = parseFloat(item.qty) - alreadyReturned
    if (this.props.noInvAfected) {
      qty = parseFloat(item.qty)
    }
    this.props.dispatch(addToReturn(item, qty, alreadyReturned, this.props.noInv))
  }

  render() {

    const sale = this.props.sale
    const items2 = sale.cart
      ? sale.cart.cartItems.map((item, index) => {
        const alreadyReturned = getAlreadyReturnedQty(item, sale, this.props.noInv)
        const alreadyIncart = this.props.returnItems.find(row => { return row.uuid == item.uuid })
        const alreadyAddedClass = alreadyIncart ? 'already-added' : ''
        let grayedClass = alreadyReturned >= parseFloat(item.qty) ? 'cart-body-item all-returned' : 'cart-body-item'
        // IF NOT INV SETTED THE PREVIOUS RETURNED QTY DOES NOT MATTER
        if (this.props.noInv) {
          grayedClass = 'cart-body-item'
        }
        return <div className={`${grayedClass} ${alreadyAddedClass}`} key={item.uuid} >

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
          <div className='cart-body-item-returned'>
            <h5>Devuelto</h5>
            {alreadyReturned}
          </div>
          <div className='cart-body-item-total'>
            <h5>Total</h5>
              ₡ {item.totalWithIv.formatMoney(2, ',', '.')}
          </div>
          <div className='cart-body-item-add'>
            <h5>Agregar</h5>
            <i className='fa fa-chevron-right' onClick={this.addItem.bind(this, item, alreadyIncart)} />
          </div>

        </div>
      })
      : <div />

    return <div id='cart-body' className='cart-body'>
      {items2}
    </div>

  }

}
