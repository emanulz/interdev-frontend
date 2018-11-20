import React from 'react'
import {connect} from 'react-redux'
import {updateStoreCardAuth, updateStoreCardDigits, updateStoreCardAmount} from '../actions'

@connect((store) => {
  return {
    cardAuth: store.pay.payObject.card[0].auth,
    cardDigits: store.pay.payObject.card[0].digits,
    cardAmount: store.pay.payObject.card[0].amount,
    cartTotal: store.cart.cartTotal,
    client: store.clients.clientSelected,
    payObject: store.pay.payObject,
    isCredit: store.pay.isCredit
  }
})
export default class PayCard extends React.Component {

  payCardAmountChanged(ev) {

    this.props.dispatch(updateStoreCardAmount(
      ev.target.value,
      this.props.cartTotal,
      this.props.client,
      this.props.payObject,
      this.props.dispatch,
      this.props.isCredit
    ))
  }

  payCardAuthChanged(ev) {

    this.props.dispatch(updateStoreCardAuth(ev.target.value))
  }

  payCardDigitsChanged(ev) {

    this.props.dispatch(updateStoreCardDigits(ev.target.value))
  }

  payCardChanged(ev) {
    // THIS FUNCTION WILL UPDATE THE CASH AMOUNT AND AUTOUPDATE THE CREDIT AMOUNT
    if (ev.key == 'Enter') {
      document.getElementById('saveSaleButton').focus()
    }
  }

  render() {

    return <div className='pay-method-body'>

      <div className='pay-method-body-header'>
        <span>Tarjeta</span>
      </div>

      <div className='pay-method-body-content'>

        <div className='pay-tag left'>MONTO:</div>
        <input value={this.props.cardAmount} onKeyUp={this.payCardChanged.bind(this)} onChange={this.payCardAmountChanged.bind(this)} type='Number' className='form-control mousetrap' />

        <div className='pay-tag left'>4 DIGITOS:</div>
        <input value={this.props.cardDigits} onKeyUp={this.payCardChanged.bind(this)} onChange={this.payCardDigitsChanged.bind(this)} type='Number' className='form-control mousetrap' />

        <div className='pay-tag left'>AUTORIZACIÓN:</div>
        <input value={this.props.cardAuth} onKeyUp={this.payCardChanged.bind(this)} onChange={this.payCardAuthChanged.bind(this)} type='Number' className='form-control mousetrap' />

        <br />
        <br />

      </div>

    </div>

  }

}
