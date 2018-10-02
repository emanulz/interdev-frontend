import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
import {getItemDispatch} from '../../actions.js'

@connect((store) => {
  return {
    cart: store.cart,
    client: store.clients.clientSelected.client,
    user: store.newBill.user,
    presaleType: store.newBill.presale_type,
    reserves_warehouse: store.config.reserves_warehouse,
    extras: store.extras,
    tables: store.tables.tables,
    tableActive: store.tables.tableActive,
    loggedUser: store.user.user
  }
})
export default class SaveBtn extends React.Component {

  saveBtn() {
    // const sales = this.props.sales
    const extras = this.props.extras
    const tableSelected = this.props.tables.find(item => item.id == this.props.tableActive)
    extras.tableName = tableSelected.indentifier
    console.log('EXTRAS', extras)
    const newBill = {
      user: JSON.stringify(this.props.loggedUser),
      client_id: this.props.client.id,
      extras: JSON.stringify(extras)
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
      alertify.alert('Completado', 'Cuenta abierta correctamente')
      _this.props.dispatch({type: 'HIDE_NEW_BILL_PANEL', payload: ''})
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      // AFTER SAVE REFETCH
      const tableId = _this.props.tableActive
      if (tableId) {
        const tableBillsKwargs = {
          url: `/api/restauranttables/${tableId}/tablebills/`,
          successType: 'FETCH_TABLE_BILLS_FULFILLED',
          errorType: 'FETCH_TABLE_BILLS_REJECTED'
        }
        _this.props.dispatch(getItemDispatch(tableBillsKwargs))
      }
    }).catch((err) => {
      console.log(err)
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
