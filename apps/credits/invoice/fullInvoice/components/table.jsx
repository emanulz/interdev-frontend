import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {payment: store.payments.paymentActive}
})
export default class Table extends React.Component {

  // Main Layout
  render() {

    const movements = this.props.payment.movements
    const items = movements.length
      ? movements.map((item) => {
        const saleObjectToUse = item.sale ? item.sale : item.presale ? item.presale : item
        const dateObj = saleObjectToUse.created ? new Date(saleObjectToUse.created) : ''
        const date = saleObjectToUse.created
          ? `${('0' + dateObj.getDate()).slice(-2)}/
          ${('0' + (dateObj.getMonth() + 1)).slice(-2)}/
          ${dateObj.getFullYear()}`
          : '01/01/1970'

        return <tr key={saleObjectToUse.id}>
          <td>
            {saleObjectToUse.consecutive}
          </td>
          <td>
            {date}
          </td>
          <td>
            ₡ {Math.abs(parseFloat(item.previous_balance)).formatMoney(2, ',', '.')}
          </td>
          <td>
            ₡ {parseFloat(item.amount).formatMoney(2, ',', '.')}
          </td>
          <td>
            ₡ {(Math.abs(parseFloat(item.previous_balance)) - parseFloat(item.amount)).formatMoney(2, ',', '.')}
          </td>
        </tr>
      })
      : <tr>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

    return <table className='full-invoice-table table'>
      <thead>
        <tr>
          <th>Factura #</th>
          <th className='description-row'>Fecha Factura</th>
          <th>Saldo Anterior</th>
          <th>Monto</th>
          <th>Nuevo Saldo</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </table>

  }

}
