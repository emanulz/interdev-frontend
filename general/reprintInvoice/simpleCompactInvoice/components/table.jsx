import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    ticket: store.reprintInvoice.ticket,
    invoice: store.reprintInvoice.invoice,
    currencySymbol: store.currency.symbolSelected,
    receiptStyles: store.config.receiptStyles,
    config: store.config.globalConf
  }
})
export default class Table extends React.Component {

  // Main Layout
  render() {
    const symbol = this.props.currencySymbol

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

    const cartItems = this.props.sale.cart ? this.props.sale.cart.cartItems : []

    const fontFamily = this.props.receiptStyles.simpleCompactInvoiceFont ? this.props.receiptStyles.simpleCompactInvoiceFont : 'Arial'
    const fontSize = this.props.receiptStyles.simpleCompactInvoiceFontSize ? this.props.receiptStyles.simpleCompactInvoiceFontSize : '10px'

    const tableStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      marginTop: '5px',
      border: 'none'
    }

    const headerStyles = {
      fontSize: fontSize,
      fontFamily: fontFamily,
      display: 'flex',
      flexFlow: 'row',
      fontWeight: 'bold'
    }

    const bodyStyles = {
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: 'bold',
      borderTop: '1px solid black',
      marginTop: '5px'
    }

    const itemStyles = {
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: 'bold',
      width: '100%',
      padding: '2px 0',
      borderBottom: '1px solid black'
    }

    const descriptionStyles = {
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: 'bold',
      width: '100%',
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'center',
      overflow: 'hidden'
    }

    const dataStyles = {
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: 'bold',
      width: '100%',
      display: 'flex',
      flexFlow: 'row',
      marginTop: '3px'
    }

    // TAXES HEADER TEXT
    let taxesHeader = ''
    if (XMLVersion == '4.2' || XMLVersion == '') {
      taxesHeader = 'IV'
    } else if (XMLVersion == '4.3') {
      taxesHeader = 'IVA'
    } else {
      taxesHeader = ''
    }

    const items = cartItems.map((item) => {

      let taxesText = ''
      if (XMLVersion == '4.2' || XMLVersion == '') {
        taxesText = (item.product.use_taxes || item.product.use_taxes2 || item.product.use_taxes3)
          ? `G`
          : `E`
      } else if (XMLVersion == '4.3') {
        taxesText = item.product.taxes_IVA ? `${parseFloat(item.product.taxes_IVA).toFixed(0)}%` : '%'
      } else {
        taxesText = '%'
      }

      return <div style={itemStyles} key={item.uuid}>
        <div style={descriptionStyles}>
          {item.product.description}
        </div>
        <div style={dataStyles}>
          <div style={{width: '25%'}}>
            {item.qty}
          </div>
          <div style={{width: '25%', textAlign: 'left'}}>
            {item.product.code}
          </div>
          <div style={{width: '20%', textAlign: 'center'}}>
            {taxesText}
          </div>
          <div style={{width: '30%', textAlign: 'right'}}>
            {symbol} {item.subTotalNoDiscount.formatMoney(2, ',', '.')}
          </div>
        </div>
      </div>
    })

    return <div style={tableStyles}>
      <div style={headerStyles}>
        <div style={{width: '25%'}}>Cant</div>
        <div style={{width: '25%', textAlign: 'left'}}>Código</div>
        <div style={{width: '20%', textAlign: 'center'}}>{taxesHeader}</div>
        <div style={{width: '30%', textAlign: 'right'}}>Total</div>
      </div>
      <div style={bodyStyles}>
        {items}
      </div>

    </div>

  }

}
