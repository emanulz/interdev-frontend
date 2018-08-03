import React from 'react'
import {connect} from 'react-redux'
import {updateStoreCreditAmount, autoUpdateCreditAmount} from '../actions.js'

@connect((store) => {
  return {
    client: store.clients.clientSelected.client,
    debt: store.clients.clientSelectedDebt,
    creditAmount: store.pay.payObject.cred[0].amount,
    isCredit: store.pay.isCredit,
    cartTotal: store.cart.cartTotal,
    payObject: store.pay.payObject
  }
})
export default class PayCredit extends React.Component {

  cardAmountChanged(ev) {

    this.props.dispatch(updateStoreCreditAmount(ev.target.value))
  }

  changeIsCredit(ev) {
    const isCredit = ev.target.checked
    this.props.dispatch({type: 'CHANGE_IS_CREDIT', payload: isCredit})
    if (isCredit) {
      autoUpdateCreditAmount(
        'CRED',
        0,
        this.props.cartTotal,
        this.props.client,
        this.props.payObject,
        this.props.dispatch)
    } else {
      this.props.dispatch({
        type: 'UPDATE_CREDIT_AMOUNT',
        payload: 0
      })
    }
  }

  render() {
    const available = parseFloat(this.props.client.credit_limit) - parseFloat(this.props.debt)
    const clientLimit = this.props.client.has_credit
      ? `₡ ${parseFloat(this.props.client.credit_limit).formatMoney(2, ',', '.')}`
      : 'SIN CRÉDITO'
    const clientAvailable = this.props.client.has_credit
      ? `₡ ${available.formatMoney(2, ',', '.')}`
      : 'SIN CRÉDITO'

    return <div className='pay-method-body'>

      <div className='pay-method-body-header'>
        <span>Crédito</span>
      </div>

      <div className='pay-method-body-content'>
        <div>
          <div className='pay-tag left'>ES CRÉDITO:</div>
          <input disabled={!this.props.client.has_credit} type='checkbox' checked={this.props.isCredit} onChange={this.changeIsCredit.bind(this)} />
        </div>

        <div className='pay-tag left'>MONTO:</div>
        <div className='pay-tag right'>
          ₡ {this.props.creditAmount.formatMoney(2, ',', '.')}</div>
        {/* <input value={this.props.creditAmount} onChange={this.cardAmountChanged.bind(this)} type='Number' className='form-control' /> */}

        <div className='pay-tag left'>LÍMITE:</div>
        <div className='pay-tag right'>
          {clientLimit}
        </div>

        <div className='pay-tag left'>DISPONIBLE:</div>
        <div className='pay-tag right'>
          {clientAvailable}</div>

        <br />
        <br />

      </div>

    </div>

  }

}
