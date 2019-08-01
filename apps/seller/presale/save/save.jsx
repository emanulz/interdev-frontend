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
    payMethod: store.send.pay_method,
    conf: store.config.globalConf,
    exemptionData: store.taxExemption.exemptionData,
    isExempt: store.taxExemption.isExempt
  }
})
export default class SaveBtn extends React.Component {

  saveBtn() {
    // const sales = this.props.sales
    document.getElementById('sendPresaleButton').disabled = true
    document.getElementById('sendPresaleButton').blur()

    const start = Date.now()
    let now = start
    while (now - start < 200) {
      now = Date.now()
    }

    const user = this.props.user

    const cart = this.props.cart
    const exemptionData = this.props.exemptionData
    // the tax Amout for exemption is th exemption total
    exemptionData['exemptAmount'] = cart['cartExemptAmount']
    exemptionData['isExempt'] = this.props.isExempt
    cart['exemption_data'] = exemptionData

    const presale = {
      cart: JSON.stringify(cart),
      client: JSON.stringify(this.props.client),
      user: JSON.stringify(this.props.user),
      client_id: this.props.client.id,
      extras: JSON.stringify(this.props.extras),
      closed: true,
      presale_type: this.props.presaleType,
      currency_code: this.props.currency,
      exchange_rate: this.props.exchange,
      advance_amount: this.props.advanceAmount,
      pay_method: this.props.payMethod
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
        this.props.dispatch(loadPresaleToPrint(data.consecutive, true))
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
      document.getElementById('sendPresaleButton').disabled = false
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
