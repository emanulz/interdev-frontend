import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale
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

  render() {
    const sale = this.props.sale
    // SET THE DEFAULT VALUES
    let total = 0
    let payObject = {}
    // LOAD ITEMS FROM SALE ONLY IF LOADED
    if (Object.keys(sale).length > 0) {
      total = sale.cart.cartTotal
      payObject = sale.pay
    }
    const cashAmount = this.geyPayCashAmount(payObject)
    const cash = cashAmount > 0
      ? <tr>
        <th>Efectivo</th>
        <td>₡ {cashAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : ''
    const changeAmount = cashAmount - total
    const change = changeAmount > 0.01
      ? <tr>
        <th>Vuelto</th>
        <td>₡ {changeAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : 'Pago Completo'

    return <div className='reprint-compact-invoice-payment'>
      <table>
        <tbody>
          {cash}
          {change}
        </tbody>
      </table>

    </div>

  }

}
