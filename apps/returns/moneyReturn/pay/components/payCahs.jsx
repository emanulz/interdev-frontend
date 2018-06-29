import React from 'react'
import {connect} from 'react-redux'
import {updateStoreCashAmount} from '../actions.js'

@connect((store) => {
  return {
    cashAmount: store.pay.payObject.cash[0].amount,
    cartTotal: store.cart.cartTotal,
    client: store.clients.clientSelected,
    payObject: store.pay.payObject,
    isCredit: store.pay.isCredit
  }
})
export default class PayCash extends React.Component {

  payAmountChanged(ev) {
    // THIS FUNCTION WILL UPDATE THE CASH AMOUNT AND AUTOUPDATE THE CREDIT AMOUNT
    this.props.dispatch(updateStoreCashAmount(
      ev.target.value,
      this.props.cartTotal,
      this.props.client,
      this.props.payObject,
      this.props.dispatch,
      this.props.isCredit
    ))
  }

  render() {

    return <div className='pay-method-body'>

      <div className='pay-method-body-header'>
        <span>Efectivo</span>
      </div>

      <div className='pay-method-body-content'>

        <div className='pay-tag left'>EFECTIVO:</div>
        <input value={this.props.cashAmount} onChange={this.payAmountChanged.bind(this)} type='Number' className='form-control' />

        <br />
        <br />

      </div>

    </div>

  }

}
