import React from 'react'
import {connect} from 'react-redux'
import {updateStoreCreditAmount} from '../actions.js'

@connect((store) => {
  return {
    client: store.clients.clientSelected,
    debt: store.clients.clientSelectedDebt,
    creditAmount: store.pay.payObject.cred[0].amount}
})
export default class PayCredit extends React.Component {

  cardAmountChanged(ev) {

    this.props.dispatch(updateStoreCreditAmount(ev.target.value))
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

        <div className='pay-tag left'>LÍMITE:</div>
        <div className='pay-tag right'>
          {clientLimit}
        </div>

        <div className='pay-tag left'>DISPONIBLE:</div>
        <div className='pay-tag right'>
          {clientAvailable}</div>

        <div className='pay-tag left'>MONTO:</div>
        <input value={this.props.creditAmount} onChange={this.cardAmountChanged.bind(this)} type='Number' className='form-control' />

        <br />
        <br />

      </div>

    </div>

  }

}
