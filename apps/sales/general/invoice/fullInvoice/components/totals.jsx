import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    total: store.cart.cartTotal,
    taxes: store.cart.cartTaxes,
    discountTotal: store.cart.discountTotal,
    subTotalNoDiscount: store.cart.cartSubtotalNoDiscount,
    itemsInCart: store.cart.cartItems,
    globalDiscount: store.cart.globalDiscount,
    payObject: store.pay.payObject,
    isExempt: store.cart.isExempt,
    exemptAmount: store.cart.cartExemptAmount
  }
})
export default class Totals extends React.Component {

  getPayCashAdvances(payObject) {
    let total = 0
    for (const item in payObject.csha) {
      total += payObject.csha[item].amount
    }
    return total
  }

  render() {

    let advance = <tr />
    let total2 = <tr />
    const advances = this.getPayCashAdvances(this.props.payObject)
    if (advances > 0) {
      advance = <tr className='total-row'>
        <th>Adelanto</th>
        <td>₡ {advances.formatMoney(2, ',', '.')}</td>
      </tr>
      total2 = <tr className='total-row'>
        <th>Pago</th>
        <td>₡ {(this.props.total - advances).formatMoney(2, ',', '.')}</td>
      </tr>
    }

    const ExemptTotal = this.props.isExempt
      ? <tr>
        <th>IV Exonerado:</th>
        <td>₡ {this.props.exemptAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    return <div className='full-invoice-totals'>

      <table>
        <tbody>
          <tr>
            <th>Sub-total</th>
            <td>₡ {this.props.subTotalNoDiscount.formatMoney(2, ',', '.')}</td>

          </tr>
          <tr>
            <th>Descuento</th>
            <td>₡ {this.props.discountTotal.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr>
            <th>IV</th>
            <td>₡ {this.props.taxes.formatMoney(2, ',', '.')}</td>
          </tr>
          {ExemptTotal}
          <tr className='total-row'>
            <th>Total</th>
            <td>₡ {this.props.total.formatMoney(2, ',', '.')}</td>
          </tr>
          {advance}
          {total2}
        </tbody>
      </table>

    </div>

  }

}
