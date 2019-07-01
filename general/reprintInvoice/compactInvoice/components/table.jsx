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

    // TAXES HEADER TEXT
    let taxesHeader = ''
    if (XMLVersion == '4.2' || XMLVersion == '') {
      taxesHeader = 'IV'
    } else if (XMLVersion == '4.3') {
      taxesHeader = 'IVA'
    } else {
      taxesHeader = ''
    }

    const cartItems = this.props.sale.cart ? this.props.sale.cart.cartItems : []
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

      return <div className='reprint-compact-invoice-table-body-item' key={item.uuid}>
        <div className='reprint-compact-invoice-table-body-item-description'>
          {item.product.description}
        </div>
        <div className='reprint-compact-invoice-table-body-item-data'>
          <div className='reprint-compact-invoice-table-body-item-data-qty'>
            {item.qty}
          </div>
          <div className='reprint-compact-invoice-table-body-item-data-code'>
            {item.product.code}
          </div>
          <div className='reprint-compact-invoice-table-body-item-data-iv'>
            {taxesText}
          </div>
          <div className='reprint-compact-invoice-table-body-item-data-total'>
            {symbol} {item.subTotalNoDiscount.formatMoney(2, ',', '.')}
          </div>
        </div>
      </div>
    })

    return <div className='reprint-compact-invoice-table'>
      <div className='reprint-compact-invoice-table-header'>
        <div className='reprint-compact-invoice-table-header-qty'>Cant</div>
        <div className='reprint-compact-invoice-table-header-code'>Código</div>
        <div className='reprint-compact-invoice-table-header-iv'>{taxesHeader}</div>
        <div className='reprint-compact-invoice-table-header-total'>Total</div>
      </div>
      <div className='reprint-compact-invoice-table-body'>
        {items}
      </div>

    </div>

  }

}
