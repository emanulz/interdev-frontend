import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'
import {loadPresaleToPrint} from '../../../../general/printPresale/actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    cart: store.cart,
    client: store.clients.clientSelected.client,
    user: store.send.user,
    presaleType: store.send.presale_type,
    reserves_warehouse: store.userProfile.reservesWarehouse,
    extras: store.extras,
    currency: store.currency.currencySelected,
    exchange: store.currency.exchangeRateSelected,
    advanceAmount: store.send.advance_amount,
    conf: store.config.globalConf
  }
})
export default class SaveBtn extends React.Component {

  saveBtn() {
    // const sales = this.props.sales
    const user = this.props.user

    const presale = {
      cart: JSON.stringify(this.props.cart),
      client: JSON.stringify(this.props.client),
      user: JSON.stringify(this.props.user),
      client_id: this.props.client.id,
      extras: JSON.stringify(this.props.extras),
      closed: true,
      presale_type: this.props.presaleType,
      currency_code: this.props.currency,
      exchange_rate: this.props.exchange,
      advance_amount: this.props.advanceAmount
    }

    const creditMovement = {
      client_id: this.props.client.id,
      movement_type: 'CRED',
      amount: this.props.cart.cartTotal
    }

    const kwargs = {
      url: '/api/presales/',
      item: presale,
      logCode: 'PRESALE_CREATE',
      logDescription: 'Creación de nueva Preventa',
      logModel: 'PRESALE',
      user: user,
      itemOld: '',
      sucessMessage: 'Preventa enviada a caja correctamente.',
      errorMessage: 'Hubo un error al crear la preventa, intente de nuevo.',
      creditMovement: creditMovement
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
      if (data.presale_type == 'RESERVE' || data.presale_type == 'QUOTING' || data.presale_type == 'NS_RESERVE') {
        this.props.dispatch(loadPresaleToPrint(data.consecutive))
      } else {
        if (this.props.conf.NoF5AfterSendOrPrint) {
          alertify.alert('COMPLETADO', 'Preventa Enviada a Caja Correctamente')
            .set('onok', function(closeEvent) {
              window.location.href = '/seller'
            })
        } else {
          alertify.alert('COMPLETADO', 'Preventa Enviada a Caja Correctamente')
        }
      }
    }).catch((err) => {
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
    })

  }

  render() {

    const btnSendText = this.props.presaleType == 'REGULAR' ? 'Enviar' : 'Guardar'
    const btnSendIcon = this.props.presaleType == 'REGULAR' ? 'fa fa-send' : 'fa fa-save'

    // return <div onClick={this.saveBtn.bind(this)} className={this.props.sendButtonClass}>
    //   {btnSendText}
    //   <i className={btnSendIcon} aria-hidden='true' />
    // </div>

    return <button disabled={this.props.disabledSend} id='sendPresaleButton' onClick={this.saveBtn.bind(this)} className={this.props.sendButtonClass}>
      {btnSendText}
      <i className={btnSendIcon} aria-hidden='true' />
    </button>

  }

}
