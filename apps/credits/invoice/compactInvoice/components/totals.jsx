import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    payment: store.payments.paymentActive
  }
})
export default class Totals extends React.Component {

  render() {

    const fontFamily = 'Arial'
    const fontSize = '16px'

    const divStyles = {
      marginTop: '20px',
      border: 'none',
      fontFamily: fontFamily,
      display: 'flex',
      justifyContent: 'flex-end'
    }

    const tableStyles = {
      width: '80%',
      border: 'none'
    }

    const thStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      padding: '5px 0',
      borderTop: '1px solid black',
      borderBottom: '1px solid black'
    }

    const tdStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
      textAlign: 'right'
    }

    const total = this.props.payment ? parseFloat(this.props.payment.amount) : 0

    return <div style={divStyles}>

      <table style={tableStyles}>
        <tbody>
          <tr>
            <th style={thStyles}>Total Pago</th>
            <td style={tdStyles}>₡ {total.formatMoney(2, ',', '.')}</td>
          </tr>
        </tbody>
      </table>

    </div>

  }

}
