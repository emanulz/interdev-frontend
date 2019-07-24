import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {payment: store.payments.paymentActive}
})
export default class Data extends React.Component {

  render() {
    // STYLES
    const fontFamily = 'Arial'
    const fontSize = '14px'

    const dataStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      padding: '10px 0'
    }

    const trStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold'
    }

    const thStyles = {
      width: '22%',
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold'
    }

    const tdStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold'
    }

    const payment = this.props.payment
    const dateObj = payment.created ? new Date(payment.created) : ''
    const date = payment.created
      ? `${('0' + dateObj.getDate()).slice(-2)}/
      ${('0' + (dateObj.getMonth() + 1)).slice(-2)}/
      ${dateObj.getFullYear()}`
      : '01/01/1970'

    const client = payment.client ? `${payment.client.code} - ${payment.client.name} ${payment.client.last_name}` : '00 - Cliente de Contado'
    const id = payment.consecutive ? payment.consecutive : '0001'

    return <div style={dataStyles}>

      <table>
        <tbody>
          <tr style={trStyles}>
            <th style={thStyles}>Fecha:</th>
            <td style={tdStyles}>{date}</td>
          </tr>
          <tr style={trStyles}>
            <th style={thStyles}>Pago:</th>
            <td style={tdStyles}>{('0000000' + id).slice(-7)}</td>

          </tr>
          <tr style={trStyles}>
            <th style={thStyles}>Cliente:</th>
            <td style={tdStyles}>{client}</td>
          </tr>

        </tbody>

      </table>

    </div>

  }

}
