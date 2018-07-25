/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    returnCart: store.returnCart,
    sale: store.sale.saleActive
  }
})
export default class Totals extends React.Component {

  // Main Layout
  render () {
    const saleTotal = this.props.sale.sale_total ? parseFloat(this.props.sale.sale_total) : 0
    const returnSubtotal = this.props.returnCart.returnSubtotal ? parseFloat(this.props.returnCart.returnSubtotal) : 0
    const returnTaxes = this.props.returnCart.returnTaxes ? parseFloat(this.props.returnCart.returnTaxes) : 0
    const returnTotal = this.props.returnCart.returnTotal ? parseFloat(this.props.returnCart.returnTotal) : 0

    return <div className='moneyReturn-aside-content-content-totals'>
      <table className='table totals-table'>
        <tbody>
          <tr>
            <th>Total Venta:</th>
            <td className='price'>₡ {saleTotal.formatMoney(2, ',', '.')}</td>

          </tr>
          <tr>
            <th>Sub-Total Devolución:</th>
            <td className='price'>₡ {returnSubtotal.formatMoney(2, ',', '.')}</td>

          </tr>

          <tr>
            <th>Total IV Devolución:</th>
            <td className='price'>₡ {returnTaxes.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr>
            {/* <th onClick={this.showInvoicePanel.bind(this)}>Total:</th> */}
            <th>Total Devolución:</th>
            <td className='price'>₡ {returnTotal.formatMoney(2, ',', '.')}</td>

          </tr>
        </tbody>
      </table>
    </div>
  }

}
