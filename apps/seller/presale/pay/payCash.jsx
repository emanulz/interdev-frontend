import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    currencySymbol: store.currency.symbolSelected,
    globalConf: store.config.globalConf,
    user: store.user,
    cashAmount: store.pay.cashAmount,
    cart: store.cart
  }
})
export default class PayCash extends React.Component {

  setCashAmount(ev) {
    ev.preventDefault()
    if (ev.key == 'Enter') {
      document.getElementById('sendPresaleButton').focus()
    } else {
      const value = ev.target.value
      this.props.dispatch({type: 'SET_PRESALE_CASH_AMOUNT', payload: value})
      this.props.dispatch({type: 'SET_SEND_USER', payload: this.props.user.user})
      this.props.dispatch({type: 'SET_SEND_USER_PROFILE', payload: this.props.user.profile})
    }
  }

  render() {
    const symbol = this.props.currencySymbol
    const total = parseFloat(this.props.cart.cartTotal)
    const payCash = parseFloat(this.props.cashAmount)
    const change = payCash - total

    return <div className='send-method-body'>

      <div className='send-method-body-header'>
        <span>Efectivo</span>
      </div>

      <div className='send-method-body-content'>
        <div className='send-tag-inline'>
          <div className='first'>EFECTIVO:</div>
          <input autoComplete='test' id='presaleCashInput' value={this.props.cashAmount} onKeyUp={this.setCashAmount.bind(this)} onChange={this.setCashAmount.bind(this)} type='number' className='second mousetrap' />
        </div>
        <div className='send-tag-inline'>
          <div className='first'>VUELTO:</div>
          <div className='presale-change second'>{symbol} {change.formatMoney(2, ',', '.')}</div>
        </div>
      </div>

    </div>

  }

}
