import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    document: store.reprintInvoice.invoice,
    currencySymbol: store.currency.symbolSelected,
    config: store.config.globalConf
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
    const symbol = this.props.currencySymbol
    const sale = this.props.sale
    // SET THE DEFAULT VALUES
    let total = 0
    let taxes = 0
    let discountTotal = 0
    let subTotalNoDiscount = 0
    let payObject = {}
    let isExempt = false
    let exemptAmount = 0
    let returnedIVA = 0
    // LOAD ITEMS FROM SALE ONLY IF LOADED
    if (Object.keys(sale).length > 0) {
      total = sale.cart.cartTotal
      taxes = sale.cart.cartTaxes
      discountTotal = sale.cart.discountTotal
      subTotalNoDiscount = sale.cart.cartSubtotalNoDiscount
      payObject = sale.pay
      isExempt = sale.cart.isExempt
      exemptAmount = sale.cart.cartExemptAmount
      returnedIVA = sale.cart.returnedIVA
    }

    let advance = <tr />
    let total2 = <tr />
    const advances = this.getPayCashAdvances(payObject)
    if (advances > 0) {
      advance = <tr className='total-row'>
        <th>Adelantos</th>
        <td>{symbol} {(advances * -1).formatMoney(2, ',', '.')}</td>
      </tr>
      total2 = <tr className='total-row'>
        <th>Este Pago</th>
        <td>{symbol} {(total - advances).formatMoney(2, ',', '.')}</td>
      </tr>
    }

    const ExemptTotal = isExempt
      ? <tr>
        <th>IV Exonerado:</th>
        <td className='price'>{symbol} -{exemptAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    const returnedIVARow = returnedIVA > 0
      ? <tr>
        <th>IVA Devuelto:</th>
        <td className='price'>{symbol} -{returnedIVA.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    const XMLVersion = this.props.document ? this.props.document.hacienda_resolution : ''
    let taxesLine = ''
    if (XMLVersion == '4.2' || XMLVersion == '') {
      taxesLine = 'IV'
    } else if (XMLVersion == '4.3') {
      taxesLine = 'IVA'
    } else {
      taxesLine = ''
    }
    return <div className='reprint-full-invoice-totals'>

      <table>
        <tbody>
          <tr>
            <th>Sub-total</th>
            <td>{symbol} {subTotalNoDiscount.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr>
            <th>Descuento</th>
            <td>{symbol} {discountTotal.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr>
            <th>{taxesLine}</th>
            <td>{symbol} {taxes.formatMoney(2, ',', '.')}</td>
          </tr>
          {ExemptTotal}
          {returnedIVARow}
          <tr className='total-row'>
            <th>Total</th>
            <td>{symbol} {total.formatMoney(2, ',', '.')}</td>
          </tr>
          {advance}
          {total2}
        </tbody>
      </table>

    </div>

  }

}
