import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    ticket: store.reprintInvoice.ticket,
    invoice: store.reprintInvoice.invoice,
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
    let otherCharges = []
    const doNotPrintIVA = this.props.config.doNotPrintIVAInReceipt
    // LOAD ITEMS FROM SALE ONLY IF LOADED
    if (Object.keys(sale).length > 0) {
      total = sale.cart.cartTotal
      taxes = sale.cart.cartTaxes
      discountTotal = sale.cart.discountTotal
      subTotalNoDiscount = sale.cart.cartSubtotalNoDiscount
      payObject = sale.pay
      isExempt = sale.cart.isExempt
      exemptAmount = sale.cart.cartExemptAmount
      returnedIVA = sale.cart.returnedIVA ? sale.cart.returnedIVA : 0
      otherCharges = sale.cart.otherCharges ? sale.cart.otherCharges : []
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
        <th>IVA Exone:</th>
        <td className='price'>{symbol} -{exemptAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    const taxTotal = isExempt
      ? <tr>
        <th>IVA Neto:</th>
        <td className='price'>{symbol} {(parseFloat(taxes) - parseFloat(exemptAmount)).formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    const returnedIVARow = returnedIVA > 0
      ? <tr>
        <th>IVA Devuelto:</th>
        <td className='price'>{symbol} -{returnedIVA.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    // DEFINE THE VERSION OF XML
    const ticket = this.props.ticket
    const invoice = this.props.invoice
    let XMLVersion = ''
    try {
      if (ticket) {
        XMLVersion = this.props.ticket ? this.props.ticket.hacienda_resolution : ''
      }

      if (invoice) {
        XMLVersion = this.props.invoice ? this.props.invoice.hacienda_resolution : ''
      }
    } catch (err) {}

    let taxesLine = ''
    if (XMLVersion == '4.2' || XMLVersion == '') {
      taxesLine = 'IV'
    } else if (XMLVersion == '4.3') {
      taxesLine = 'IVA'
    } else {
      taxesLine = ''
    }

    const serviceAmount = this.getserviceAmount(otherCharges)

    const otherChargesRow = serviceAmount > 0
      ? <tr>
        <th>Servicio:</th>
        <td className='price'>{symbol} {serviceAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    const subTotalToPrint = doNotPrintIVA ? Math.round(subTotalNoDiscount + taxes) : subTotalNoDiscount
    const ivaRow = doNotPrintIVA
      ? <tr />
      : <tr>
        <th>{taxesLine}</th>
        <td>{symbol} {taxes.formatMoney(2, ',', '.')}</td>
      </tr>

    const discountRow = parseFloat(discountTotal) > 0
      ? <tr>
        <th>Descuento</th>
        <td>{symbol} {discountTotal.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    return <div className='reprint-compact-invoice-totals'>

      <table>
        <tbody>
          <tr>
            <th>Sub-total</th>
            <td>{symbol} {subTotalToPrint.formatMoney(2, ',', '.')}</td>

          </tr>
          {discountRow}
          {ivaRow}
          {ExemptTotal}
          {taxTotal}
          {returnedIVARow}
          {otherChargesRow}
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
