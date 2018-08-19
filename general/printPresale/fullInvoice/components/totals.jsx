import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.printPresale.presale
  }
})
export default class Totals extends React.Component {

  render() {

    const sale = this.props.sale
    // SET THE DEFAULT VALUES
    let total = 0
    let taxes = 0
    let discountTotal = 0
    let subTotalNoDiscount = 0

    // LOAD ITEMS FROM SALE ONLY IF LOADED
    if (Object.keys(sale).length > 0) {
      total = sale.cart.cartTotal
      taxes = sale.cart.cartTaxes
      discountTotal = sale.cart.discountTotal
      subTotalNoDiscount = sale.cart.cartSubtotalNoDiscount
    }

    return <div className='reprint-full-presale-totals'>

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
          <tr className='total-row'>
            <th>Total</th>
            <td>₡ {total.formatMoney(2, ',', '.')}</td>
          </tr>
        </tbody>
      </table>

    </div>

  }

}
