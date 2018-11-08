import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    currencySymbol: store.currency.symbolSelected,
    receiptStyles: store.config.receiptStyles
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
    const fontFamily = this.props.receiptStyles.simpleCompactInvoiceFont ? this.props.receiptStyles.simpleCompactInvoiceFont : 'Arial'
    const fontSize = this.props.receiptStyles.simpleCompactInvoiceFontSize ? this.props.receiptStyles.simpleCompactInvoiceFontSize : '10px'
    const paymentStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      marginTop: '5px',
      fontWeight: 'bold'
    }
    const trStyles = {
      width: '100%',
      height: '20px !important',
      lineHeight: '20px',
      fontWeight: 'bold !important'
    }

    const thStyles = {
      width: '22%',
      fontWeight: 'bold !important'
    }
    const changeStyles = {
      marginTop: '8px !important',
      borderTop: '1px solid black'
    }
    // DETERMIN THE CASH AMOUNT
    const cashAmount = this.geyPayCashAmount(payObject)
    const cash = cashAmount > 0
      ? <tr style={trStyles}>
        <th style={thStyles}>Efectivo:</th>
        <td>{symbol} {cashAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr style={{display: 'none'}} />
    // DETERMIN THE CARD AMOUNT
    const cardAmount = this.geyPayCardAmount(payObject)
    const card = cardAmount > 0
      ? <tr style={trStyles}>
        <th style={thStyles}>Tarjeta:</th>
        <td>{symbol} {cardAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr style={{display: 'none'}} />

    // DETERMIN THE TRANSFER AMOUNT
    const tranAmount = this.geyPayTransferAmount(payObject)
    const tran = tranAmount > 0
      ? <tr style={trStyles}>
        <th style={thStyles}>Transf:</th>
        <td>{symbol} {tranAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr style={{display: 'none'}} />

    // DETERMIN THE CREDIT AMOUNT
    const credAmount = this.geyPayCreditAmount(payObject)
    const cred = credAmount > 0
      ? <tr style={trStyles}>
        <th style={thStyles}>Crédito:</th>
        <td>{symbol} {credAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr style={{display: 'none'}} />
    // DETERMIN THE CHANGE
    const changeAmount = cashAmount + cardAmount + tranAmount + credAmount - total
    const change = changeAmount > 0.01
      ? <tr style={changeStyles}>
        <th style={thStyles}>Vuelto:</th>
        <td>{symbol} {changeAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr style={changeStyles}>
        <th style={thStyles}>Vuelto:</th>
        <td>Pago Completo</td>
      </tr>

    return <div style={paymentStyles}>
      <table style={{width: '100%'}}>
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
