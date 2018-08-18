/*
 * Module dependencies
 */
import React from 'react'

import Product from '../../../sales/general/product/product.jsx'
import Cart from '../../../sales/general/cart/cart.jsx'
import {connect} from 'react-redux'
import {updatePresale} from './actions.js'
import alertify from 'alertifyjs'
import {loadPresaleItem} from '../actions.js'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    fullWidth: store.presale.fullWidth,
    total: store.cart.cartTotal,
    cart: store.cart,
    client: store.clients.clientSelected.client,
    user: store.send.user,
    presaleType: store.send.presale_type,
    reserves_warehouse: store.config.reserves_warehouse,
    extras: store.extras,
    presaleActiveId: store.presale.presaleActiveId
  }
})
class Content extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  closePresale() {
    // ALERTIFY CONFIRM
    const _this = this
    alertify.confirm('Cerrar Orden', `¿Desea Cerrar la orden y calcular la cuenta? Esta acción no se puede deshacer`, function() {
      _this.savePresale(true)
    }, function() {
      return true
    }).set('labels', {
      ok: 'Cerrar',
      cancel: 'Permanecer'
    })
  }

  savePresale(close) {

    const presale = {
      cart: JSON.stringify(this.props.cart),
      client_id: this.props.client.id,
      extras: JSON.stringify(this.props.extras)
    }

    const kwargs = {
      url: `/api/presales/${this.props.presaleActiveId}/`,
      item: {presale: presale, closePresale: close}
    }

    const _this = this

    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(updatePresale(kwargs, resolve, reject))
    })

    updatePromise.then((data) => {
      console.log(data)
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('Completado', 'Orden Actualizada Correctamente')
      loadPresaleItem(data.id, _this.props.dispatch)
    }).catch((err) => {
      console.log(err)
      _this.props.dispatch({type: 'FETCHING_DONE'})
      alertify.alert('ERROR', 'Error al actualizar la orden')
    })

  }

  goToTableBillList() {
    const lookUp = this.props.location.pathname.split('/')
    const table = lookUp[lookUp.length - 2]
    this.props.history.push(`/restaurant/${table}`)
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'sale-content fullWidth' : 'sale-content'
    const cartClass = this.props.fullWidth ? 'sale-content-cart' : 'sale-content-cart fullHeight'
    const totalClass = this.props.fullWidth ? 'sale-content-total' : 'sale-content-total collapsed'
    const buttonsClass = this.props.fullWidth ? 'sale-content-buttons' : 'sale-content-buttons collapsed'

    return <div className={contentClass}>
      <div className={buttonsClass} >
        <button onClick={this.goToTableBillList.bind(this)} className='btn btn-primary' >
          <i className='fa fa-chevron-left' />
          Lista de Cuentas
        </button>
        <button onClick={this.closePresale.bind(this)} className='btn btn-success' >Cerrar <i className='fa fa-save' /></button>
        <button onClick={this.savePresale.bind(this, false)} className='btn btn-success' >Actualizar <i className='fa fa-pencil' /></button>
      </div>
      <div className='sale-content-product' >
        <Product />
      </div>
      <div className={cartClass} >
        <Cart />
      </div>
      <div className={totalClass} >
        ₡ {this.props.total.formatMoney()}
      </div>
    </div>

  }

}
// EXPORT THE CLASS WITH ROUTER
export default withRouter(Content)