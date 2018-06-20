import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    cart: store.cart,
    payMethod: store.pay.payMethod,
    payObject: store.pay.payObject,
    client: store.clients.clientSelected,
    user: store.user.user,
    debt: store.clients.clientSelectedDebt,
    warehouse_id: store.config.salesWarehouse,
    presaleId: store.presales.presaleId
    // sales: store.sales.sales,
    // saleId: store.sales.saleActiveId,
    // sale: store.sales.saleActive,
    // movements: store.clientmovements.movements
  }
})
export default class SaveBtn extends React.Component {

  saveBtn() {
    // const sales = this.props.sales
    // const user = this.props.user

    const sale = {
      cart: JSON.stringify(this.props.cart),
      client: JSON.stringify(this.props.client),
      user: JSON.stringify(this.props.user),
      pay: JSON.stringify(this.props.payObject),
      client_id: this.props.client.id,
      warehouse_id: this.props.warehouse_id,
      presale_id: this.props.presaleId
    }

    const kwargs = {
      url: '/api/sales/',
      item: sale,
      sucessMessage: 'Venta creada correctamente'
    }

    const _this = this

    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveItem(kwargs, resolve, reject))
    })
    // SAVE PROCESS
    updatePromise.then(() => {
      this.props.dispatch({type: 'HIDE_PAY_PANEL', payload: ''})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      this.props.dispatch({type: 'SHOW_INVOICE_PANEL', payload: ''})
      this.props.dispatch({type: 'PROCESS_COMPLETE', payload: ''})
      Mousetrap.reset()
    }).catch((err) => {
      console.log(err.response.data)
      if (err.response) {
        alertify.alert('ERROR', `${err.response.data[Object.keys(err.response.data)[0]]}`)
      } else {
        alertify.alert('ERROR', `Hubo un error al guardar la venta, error: ${err}`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })

  }

  render() {

    return <div onClick={this.saveBtn.bind(this)} className={this.props.payButtonClass}>
      Registrar
      <i className='fa fa-credit-card' aria-hidden='true' />
    </div>

  }

}
