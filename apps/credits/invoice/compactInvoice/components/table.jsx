import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {payment: store.payments.paymentActive}
})
export default class Table extends React.Component {

  // Main Layout
  render() {
    // STYLES
    const fontFamily = 'Arial'
    const fontSize = '15px'

    const tableStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      marginTop: '10px',
      border: 'none',
      width: '100%'
    }

    const tableHeadThStyles = {
      padding: '5px 0'

    }

    const tableBodyTdStyles = {
      padding: '10px 0'
    }

    const tableBodyTrStyles = {
      borderTop: '1px solid black'
    }

    const sales = this.props.payment.records
    const items = sales.length
      ? sales.map((item) => {

        const dateObj = item.sale.created ? new Date(item.sale.created) : ''
        const date = item.sale.created
          ? `${('0' + dateObj.getDate()).slice(-2)}/
          ${('0' + (dateObj.getMonth() + 1)).slice(-2)}/
          ${dateObj.getFullYear()}`
          : '01/01/1970'

        return <tr style={tableBodyTrStyles} key={item.sale.id}>
          <td style={tableBodyTdStyles}>
            {item.sale.consecutive}
          </td>
          <td style={tableBodyTdStyles}>
            {date}
          </td>
          <td style={tableBodyTdStyles}>
            ₡ {parseFloat(item.amount).formatMoney(2, ',', '.')}
          </td>
        </tr>
      })
      : <tr>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

    return <table style={tableStyles}>
      <thead>
        <tr>
          <th style={tableHeadThStyles}>Factura #</th>
          <th style={tableHeadThStyles}>Fecha Factura</th>
          <th style={tableHeadThStyles}>Monto</th>
        </tr>
      </thead>
      <tbody>
        {items}
      </tbody>

    </table>

  }

}
