import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    currencySymbol: store.currency.symbolSelected,
    receiptStyles: store.config.receiptStyles,
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

    const fontFamily = this.props.receiptStyles.simpleCompactInvoiceFont ? this.props.receiptStyles.simpleCompactInvoiceFont : 'Arial'
    const fontSize = this.props.receiptStyles.simpleCompactInvoiceFontSize ? this.props.receiptStyles.simpleCompactInvoiceFontSize : '10px'

    const totalsStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      marginTop: '8px',
      display: 'flex',
      justifyContent: 'flex-end',
      fontWeight: 'bold'
    }

    const thStyles = {
      width: '45%',
      textAlign: 'right',
      paddingRight: '20px',
      background: 'none',
      color: 'black',
      fontSize: fontSize
    }

    const tdStyles = {
      padding: '2px',
      fontFamily: fontFamily,
      fontSize: fontSize,
      textAlign: 'right',
      color: 'black'
    }

    const advances = this.getPayCashAdvances(payObject)
    if (advances > 0) {
      advance = <tr className='total-row'>
        <th style={thStyles}>Adelantos</th>
        <td style={tdStyles}>{symbol} {(advances * -1).formatMoney(2, ',', '.')}</td>
      </tr>
      total2 = <tr className='total-row'>
        <th style={thStyles}>Este Pago</th>
        <td style={tdStyles}>{symbol} {(total - advances).formatMoney(2, ',', '.')}</td>
      </tr>
    }

    const ExemptTotal = isExempt
      ? <tr>
        <th>IV Exonerado:</th>
        <td style={tdStyles} className='price'>{symbol} -{exemptAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />

    const XMLVersion = this.props.config.overrideXMLversion
    let taxesLine = ''
    if (XMLVersion == '4.2' || XMLVersion == '') {
      taxesLine = 'IV'
    } else if (XMLVersion == '4.3') {
      taxesLine = 'IVA'
    } else {
      taxesLine = ''
    }
    return <div style={totalsStyles}>
      <table style={{width: '80%'}}>
        <tbody>
          <tr>
            <th style={thStyles}>Sub-total</th>
            <td style={tdStyles}>{symbol} {subTotalNoDiscount.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr>
            <th style={thStyles}>Descuento</th>
            <td style={tdStyles}>{symbol} {discountTotal.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr>
            <th style={thStyles}>{taxesLine}</th>
            <td style={tdStyles}>{symbol} {taxes.formatMoney(2, ',', '.')}</td>
          </tr>
          {ExemptTotal}
          <tr className='total-row'>
            <th style={thStyles}>Total</th>
            <td style={tdStyles}>{symbol} {total.formatMoney(2, ',', '.')}</td>
          </tr>
          {advance}
          {total2}
        </tbody>
      </table>

    </div>

  }

}
