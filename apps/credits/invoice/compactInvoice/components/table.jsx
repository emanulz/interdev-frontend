import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {payment: store.payments.paymentActive}
})
export default class Table extends React.Component {

  // Main Layout
  render() {

    const sales = this.props.payment.sales
    const items = sales.length
      ? sales.map((item) => {

        const dateObj = item.sale.created ? new Date(item.sale.created) : ''
        const date = item.sale.created
          ? `${('0' + dateObj.getDate()).slice(-2)}/
          ${('0' + (dateObj.getMonth() + 1)).slice(-2)}/
          ${dateObj.getFullYear()}`
          : '01/01/1970'

        return <tr key={item.sale.id}>
          <td>
            {item.sale.consecutive}
          </td>
          <td>
            {date}
          </td>
          <td>
            ₡ {parseFloat(item.amount).formatMoney(2, ',', '.')}
          </td>
        </tr>
      })
      : <tr>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

    return <table className='compact-invoice-table table'>
      <thead>
        <tr>
          <th>Factura #</th>
          <th>Fecha Factura</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody className=''>
        {items}
      </tbody>

    </table>

  }

}
