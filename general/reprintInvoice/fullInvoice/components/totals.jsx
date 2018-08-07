import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale
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

    const sale = this.props.sale
    // SET THE DEFAULT VALUES
    let total = 0
    let taxes = 0
    let discountTotal = 0
    let subTotalNoDiscount = 0
    let payObject = {}
    let isExempt = false
    let exemptAmount = 0
    // LOAD ITEMS FROM SALE ONLY IF LOADED
    if (Object.keys(sale).length > 0) {
      total = sale.cart.cartTotal
      taxes = sale.cart.cartTaxes
      discountTotal = sale.cart.discountTotal
      subTotalNoDiscount = sale.cart.cartSubtotalNoDiscount
      payObject = sale.pay
      isExempt = sale.cart.isExempt
      exemptAmount = sale.cart.cartExemptAmount
    }

    let advance = <tr />
    let total2 = <tr />
    const advances = this.getPayCashAdvances(payObject)
    if (advances > 0) {
      advance = <tr className='total-row'>
        <th>Adelanto</th>
        <td>₡ {advances.formatMoney(2, ',', '.')}</td>
      </tr>
      total2 = <tr className='total-row'>
        <th>Pago</th>
        <td>₡ {(total - advances).formatMoney(2, ',', '.')}</td>
      </tr>
    }

    const ExemptTotal = isExempt
      ? <tr>
        <th>IV Exonerado:</th>
        <td className='price'>₡ -{exemptAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    return <div className='reprint-full-invoice-totals'>

      <table>
        <tbody>
          <tr>
            <th>Sub-total</th>
            <td>₡ {subTotalNoDiscount.formatMoney(2, ',', '.')}</td>

          </tr>
          <tr>
            <th>Descuento</th>
            <td>₡ {discountTotal.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr>
            <th>IV</th>
            <td>₡ {taxes.formatMoney(2, ',', '.')}</td>
          </tr>
          {ExemptTotal}
          <tr className='total-row'>
            <th>Total</th>
            <td>₡ {total.formatMoney(2, ',', '.')}</td>
          </tr>
          {advance}
          {total2}
        </tbody>
      </table>

    </div>

  }

}
