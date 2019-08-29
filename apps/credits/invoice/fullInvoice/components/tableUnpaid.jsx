import React from 'react'
import {connect} from 'react-redux'
import {formatDate, formatDateTimeAmPm} from '../../../../../utils/formatDate.js'

@connect((store) => {
  return {
    payment: store.payments.paymentActive,
    client: store.clients.clientActive,
    clientActiveSalesWithDebt: store.unpaidSales.clientActiveSalesWithDebt
  }
})
export default class TableUnpaid extends React.Component {

  getPendingItem(item) {
    const saleObjectToUse = item.sale ? item.sale : item.presale ? item.presale : item
    const date = formatDate(saleObjectToUse.created)
    const typeText = item.sale ? 'FACTURA DE VENTA' : item.presale ? 'APARTADO' : 'MOVIMIENTO MANUAL'
    return <tr key={`${saleObjectToUse.consecutive}_${typeText}`}>
      <td>{saleObjectToUse.consecutive}</td>
      <td>{date}</td>
      <td>₡ {saleObjectToUse.sale_total ? parseFloat(saleObjectToUse.sale_total).formatMoney(2, ',', '.') : 0}</td>
      {/* <td>₡ {sale.debits ? sale.debits.formatMoney(2, ',', '.') : 0}</td> */}
      <td>₡ {item.balance ? parseFloat(item.balance).formatMoney(2, ',', '.') : 0}</td>
      <td>{typeText}</td>
    </tr>

  }
  // Main Layout
  render() {

    const sales = this.props.clientActiveSalesWithDebt

    const rows = sales.length
      ? sales.map(sale => {
        return this.getPendingItem(sale)
      })
      : <tr>
        <td>NO HAY PENDIENTES</td>
      </tr>
    const date = formatDateTimeAmPm(new Date())
    return <div>
      <br />
      <br />
      <h1>Facturas pendientes para el cliente al: {date}</h1>
      <table className='full-invoice-table table'>
        <thead>
          <tr>
            <th>Factura #</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Deuda</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>

  }

}
