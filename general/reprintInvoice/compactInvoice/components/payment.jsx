import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    currencySymbol: store.currency.symbolSelected
  }
})
export default class Payment extends React.Component {

  getPayCashAdvances(payObject) {
    let total = 0
    for (const item in payObject.csha) {
      total += payObject.csha[item].amount
    }
    return total
  }

  geyPayCashAmount(payObject) {
    let total = 0
    for (const item in payObject.cash) {
      total += payObject.cash[item].amount
    }
    return total
  }

  geyPayCardAmount(payObject) {
    let total = 0
    for (const item in payObject.card) {
      total += payObject.card[item].amount
    }
    return total
  }

  geyPayCreditAmount(payObject) {
    let total = 0
    for (const item in payObject.cred) {
      total += payObject.cred[item].amount
    }
    return total
  }

  geyPayTransferAmount(payObject) {
    let total = 0
    for (const item in payObject.tran) {
      total += payObject.tran[item].amount
    }
    return total
  }

  calcTotalInPay () {
    const pay = this.props.sale.pay
    let total = 0
    for (const item in pay) {
      let innerAmount = 0
      for (const innerItem in pay[item]) {
        innerAmount += pay[item][innerItem].amount
      }
      total += innerAmount
    }
    return total
  }

  render() {
    const symbol = this.props.currencySymbol
    const sale = this.props.sale
    // SET THE DEFAULT VALUES
    let total = 0
    let payObject = {}
    // LOAD ITEMS FROM SALE ONLY IF LOADED
    if (Object.keys(sale).length > 0) {
      total = sale.cart.cartTotal
      payObject = sale.pay
    }
    // DETERMIN THE CASH AMOUNT
    const cashAmount = this.geyPayCashAmount(payObject)
    const cash = cashAmount > 0
      ? <tr>
        <th>Efectivo:</th>
        <td>{symbol} {cashAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr style={{display: 'none'}} />
    // DETERMIN THE CARD AMOUNT
    const cardAmount = this.geyPayCardAmount(payObject)
    const card = cardAmount > 0
      ? <tr>
        <th>Tarjeta:</th>
        <td>{symbol} {cardAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr style={{display: 'none'}} />

    // DETERMIN THE TRANSFER AMOUNT
    const tranAmount = this.geyPayTransferAmount(payObject)
    const tran = tranAmount > 0
      ? <tr>
        <th>Transf:</th>
        <td>{symbol} {tranAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr style={{display: 'none'}} />

    // DETERMIN THE CREDIT AMOUNT
    const credAmount = this.geyPayCreditAmount(payObject)
    const cred = credAmount > 0
      ? <tr>
        <th>Crédito:</th>
        <td>{symbol} {credAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr style={{display: 'none'}} />

    // DETERMIN THE ADVANCES AMOUNT
    // const advancesAmount = this.getPayCashAdvances(payObject)
    // const changeAmount = cashAmount + cardAmount + tranAmount + credAmount - advancesAmount - total

    // DETERMIN THE CHANGE
    let changeAmount = ''
    try {
      const total = parseFloat(this.props.sale.cart.cartTotal)
      const totalInPay = this.calcTotalInPay()
      changeAmount = totalInPay - total
    } catch (err) {
      console.log(err)
    }
    const change = changeAmount > 0.01
      ? <tr className='change-row' >
        <th>Vuelto:</th>
        <td>{symbol} {changeAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr className='change-row'>
        <th>Vuelto:</th>
        <td>Pago Completo</td>
      </tr>

    return <div className='reprint-compact-invoice-payment'>
      <table>
        <tbody>
          {cred}
          {tran}
          {card}
          {cash}
          {change}
        </tbody>
      </table>

    </div>

  }

}
