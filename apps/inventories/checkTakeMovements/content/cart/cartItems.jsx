/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {nullMovement} from './actions.js'
import {formatDateTimeAmPm} from '../../../../../utils/formatDate.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    cart: store.checkTakeMovements.cart,
    takeId: store.checkTakeMovements.physicalTakeId
  }
})

export default class CartItems extends React.Component {

  nullItem(code, ev) {
    const _this = this
    alertify.confirm('ANULAR MOVIMIENTO', 'Desea anular el movimiento seleccionado? Esta acción no se puede deshacer.',
      function() {},
      function() { _this.props.dispatch(nullMovement(_this.props.takeId, code)) })
      .set('labels', {ok: 'Conservar', cancel: 'Anular'})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  setProductAsActive(id, ev) {
    this.props.dispatch({type: 'SET_CHECK_TAKE_PRODUCT_ACTIVE', payload: id})
  }

  // Main Layout
  render() {
    const items = this.props.cart.movements ? this.props.cart.movements.map(item => {

      return <div className='cart-body-item' key={item.id}>
        <div className='cart-body-item-code'>
          {item.consecutive}
        </div>
        <div className='cart-body-item-description'>
          {this.props.cart.product.description}
        </div>
        <div className='cart-body-item-date'>
          {formatDateTimeAmPm(item.created)}
        </div>
        <div className='cart-body-item-qty'>
          {item.amount}
        </div>

        <span className='removeItemIcon'>
          <i onClick={this.nullItem.bind(this, item.id)} className='fa fa-times-circle' />
        </span>

      </div>
    })
      : <div />

    return <div id='cart-body' className='cart-body'>
      {items}
    </div>
  }
}
