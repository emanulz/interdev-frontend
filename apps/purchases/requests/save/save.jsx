import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'
import {loadRequestToPrint} from '../../../../general/printRequest/actions.js'

@connect((store) => {
  return {
    cart: store.cart,
    supplier: store.suppliers.supplierSelected,
    user: store.send.user,
    extras: store.extras,
    currency: store.currency.currencySelected,
    exchange: store.currency.exchangeRateSelected,
    conf: store.config.globalConf,
    isExempt: store.taxExemption.isExempt,
    project: store.order.projectSelected,
    activity: store.order.activitySelected
  }
})
export default class SaveBtn extends React.Component {

  saveBtn() {
    // const sales = this.props.sales
    document.getElementById('sendRequestButton').disabled = true
    document.getElementById('sendRequestButton').blur()

    const order = {
      cart: JSON.stringify(this.props.cart),
      supplier_id: this.props.supplier.id,
      project_id: this.props.project,
      activity_id: this.props.activity,
      user: JSON.stringify(this.props.user),
      extras: JSON.stringify(this.props.extras),
      currency_code: this.props.currency,
      exchange_rate: this.props.exchange
    }

    const kwargs = {
      url: '/api/requests/',
      item: order,
      sucessMessage: 'Orden de Cotización Creada Correctamente.',
      errorMessage: 'Hubo un error al crear la Orden de Cotización, intente de nuevo.'
    }

    const _this = this

    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveItem(kwargs, resolve, reject))
    })

    updatePromise.then((data) => {
      this.props.dispatch({type: 'HIDE_SEND_PANEL', payload: ''})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      this.props.dispatch({type: 'PROCESS_COMPLETE', payload: ''})
      // PRINT THE ORDER
      this.props.dispatch(loadRequestToPrint(data.consecutive))
    }).catch((err) => {
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
      document.getElementById('sendRequestButton').disabled = false
    })

  }

  render() {

    const btnSendText = 'Guardar'
    const btnSendIcon = 'fa fa-save'

    return <button disabled={this.props.disabledSend} id='sendRequestButton' onClick={this.saveBtn.bind(this)} className={this.props.sendButtonClass}>
      {btnSendText}
      <i className={btnSendIcon} aria-hidden='true' />
    </button>

  }

}
