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
export default class Table extends React.Component {

  // Main Layout
  render() {
    const symbol = this.props.currencySymbol
    const XMLVersion = this.props.document ? this.props.document.hacienda_resolution : ''
    const cartItems = this.props.sale.cart ? this.props.sale.cart.cartItems : []

    // TAXES HEADER TEXT
    let taxesHeader = ''
    if (XMLVersion == '4.2' || XMLVersion == '') {
      taxesHeader = 'IV'
    } else if (XMLVersion == '4.3') {
      taxesHeader = 'IVA %'
    } else {
      taxesHeader = ''
    }

    const items = cartItems.length
      ? cartItems.map((item) => {

        const description = this.props.config.printProductObservationsInFullInvoice && item.product.observations
          ? <td>
            {item.product.description}
            <br />
            {item.product.observations}
          </td>
          : <td>
            {item.product.description}
          </td>

        let taxesText = ''
        if (XMLVersion == '4.2' || XMLVersion == '') {
          taxesHeader = 'IV'
          taxesText = (item.product.use_taxes || item.product.use_taxes2 || item.product.use_taxes3)
            ? `G`
            : `E`
        } else if (XMLVersion == '4.3') {
          taxesText = item.product.taxes_IVA ? `${item.product.taxes_IVA}` : ''
        } else {
          taxesText = ''
        }

        return <tr key={item.uuid}>
          <td>
            {item.product.code}
          </td>
          {description}
          <td className='right-in-table'>
            {item.qty}
          </td>
          <td className='right-in-table'>
            {symbol} {parseFloat(item.priceToUse).formatMoney(2, ',', '.')}
          </td>
          <td className='right-in-table'>
            {item.discount}
          </td>
          <td className='right-in-table'>
            {taxesText}
          </td>
          <td className='right-in-table'>
            {symbol} {item.subTotalNoDiscount.formatMoney(2, ',', '.')}
          </td>
        </tr>
      })
      : <tr>
        <td>--</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

    return <table className='reprint-full-invoice-table table'>
      <thead>
        <tr>
          <th>Código</th>
          <th className='description-row'>Descripción</th>
          <th className='right-in-table'>Cantidad</th>
          <th className='right-in-table'>P.U</th>
          <th className='right-in-table'>Des%</th>
          <th className='right-in-table'>{taxesHeader}</th>
          <th className='right-in-table'>Precio</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </table>

  }

}
