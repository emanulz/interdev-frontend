import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    currencySymbol: store.currency.symbolSelected,
    config: store.config.globalConf
  }
})
export default class Table extends React.Component {

  // Main Layout
  render() {
    const symbol = this.props.currencySymbol
    const XMLVersion = this.props.config.overrideXMLversion

    const cartItems = this.props.sale.cart ? this.props.sale.cart.cartItems : []
    const items = cartItems.map((item) => {
      let taxesText = ''
      if (XMLVersion == '4.2' || XMLVersion == '') {
        taxesText = (item.product.use_taxes || item.product.use_taxes2 || item.product.use_taxes3)
          ? `G`
          : `E`
      } else if (XMLVersion == '4.3') {
        taxesText = item.product.taxes_IVA ? `${item.product.taxes_IVA}%` : '%'
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
        <div className='reprint-compact-invoice-table-header-iv'>IV</div>
        <div className='reprint-compact-invoice-table-header-total'>Total</div>
      </div>
      <div className='reprint-compact-invoice-table-body'>
        {items}
      </div>

    </div>

  }

}
