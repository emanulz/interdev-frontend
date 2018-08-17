import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    cart: store.cart,
    client: store.clients.clientSelected.client,
    user: store.newBill.user,
    presaleType: store.newBill.presale_type,
    reserves_warehouse: store.config.reserves_warehouse,
    extras: store.extras,
    tableActive: store.tables.tableActive
  }
})
export default class SaveBtn extends React.Component {

  saveBtn() {
    // const sales = this.props.sales

    const newBill = {
      user: JSON.stringify(this.props.user),
      client_id: this.props.client.id,
      extras: JSON.stringify(this.props.extras)
    }

    const kwargs = {
      url: `/api/restauranttables/${this.props.tableActive}/openBill/`,
      item: newBill,
      sucessMessage: 'Nueva Cuenta Creada correctamente.',
      errorMessage: 'Hubo un error al crear la cuenta, intente de nuevo.'
    }

    const _this = this

    const createPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveItem(kwargs, resolve, reject))
    })

    createPromise.then((data) => {
      this.props.dispatch({type: 'HIDE_NEW_BILL_PANEL', payload: ''})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch((err) => {
      console.log(err)
      alertify.alert('ERROR', 'Error al crear la cuenta, por favor intente de nuevo.')
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })

  }

  render() {

    const btnSendIcon = 'fa fa-send'

    return <div onClick={this.saveBtn.bind(this)} className={this.props.newBillButtonClass}>
      Abrir
      <i className={btnSendIcon} aria-hidden='true' />
    </div>

  }

}
