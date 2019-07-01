import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.printPresale.presale
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

  getserviceAmount(otherCharges) {
    let serviceAmount = 0
    otherCharges.forEach(charge => {
      if (charge.type == '06') {
        serviceAmount = serviceAmount + charge.amount
      }
    })
    return serviceAmount
  }

  render() {
    const sale = this.props.sale
    // SET THE DEFAULT VALUES
    let total = 0
    let taxes = 0
    let discountTotal = 0
    let subTotalNoDiscount = 0
    let otherCharges = []

    // LOAD ITEMS FROM SALE ONLY IF LOADED
    if (Object.keys(sale).length > 0) {
      total = sale.cart.cartTotal
      taxes = sale.cart.cartTaxes
      discountTotal = sale.cart.discountTotal
      subTotalNoDiscount = sale.cart.cartSubtotalNoDiscount
      otherCharges = sale.cart.otherCharges ? sale.cart.otherCharges : []
    }
    let wasNSReserve = false
    try {
      wasNSReserve = this.props.sale.presale_type == 'NS_RESERVE'
    } catch (err) {}

    const payments = parseFloat(total) - parseFloat(this.props.sale.balance)
    const debt = total - payments
    const extraRow1 = wasNSReserve
      ? <tr>
        <th>Abonos</th>
        <td>₡ {payments.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />
    const extraRow2 = wasNSReserve
      ? <tr>
        <th>Adeudado</th>
        <td>₡ {debt.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    const serviceAmount = this.getserviceAmount(otherCharges)

    const otherChargesRow = serviceAmount > 0
      ? <tr>
        <th>Servicio:</th>
        <td className='price'>₡ {serviceAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />
    return <div className='print-compact-presale-totals'>

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
          {otherChargesRow}
          <tr className='total-row'>
            <th>Total</th>
            <td>₡ {total.formatMoney(2, ',', '.')}</td>
          </tr>
          {extraRow1}
          {extraRow2}
        </tbody>
      </table>

    </div>

  }

}
