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
    let subTotalNoDiscount = 0
    // LOAD ITEMS FROM SALE ONLY IF LOADED
    if (Object.keys(sale).length > 0) {
      total = sale.cart.cartTotal
      taxes = sale.cart.cartTaxes
      subTotalNoDiscount = sale.cart.cartSubtotalNoDiscount
    }

    return <div className='reprint-compact-invoice-totals'>

      <table>
        <tbody>
          <tr>
            <th>Sub-total Dev</th>
            <td>₡ {subTotalNoDiscount.formatMoney(2, ',', '.')}</td>

          </tr>
          <tr>
            <th>IV Dev</th>
            <td>₡ {taxes.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr className='total-row'>
            <th>Total dev</th>
            <td>₡ {total.formatMoney(2, ',', '.')}</td>
          </tr>
        </tbody>
      </table>

    </div>

  }

}
