import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'

@connect((store) => {
  return {
    cashAdvance: store.printCashAdvance.cashAdvance,
    voucher: store.printCashAdvance.voucher
  }
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

    const cashAdvance = this.props.cashAdvance
    const voucher = this.props.voucher
    const user = Object.keys(cashAdvance).length > 0 ? cashAdvance.user : ''

    const date = cashAdvance.created
      ? `${formatDateTimeAmPm(cashAdvance.created)}`
      : `${formatDateTimeAmPm(new Date())}`
    const cashierName = user.first_name
      ? `${user.first_name} ${user.last_name}`
      : user.length ? `${user.username}` : ''

    const client = cashAdvance.client ? `${cashAdvance.client.code} - ${cashAdvance.client.name} ${cashAdvance.client.last_name}` : '00 - Cliente de Contado'
    const consecutive = cashAdvance.consecutive ? cashAdvance.consecutive : '0001'
    const voucherConsecutive = voucher.consecutive ? voucher.consecutive : 'SIN VALE'

    const workOrderOrVoucher = cashAdvance.work_order_id
      ? <tr>
        <th>Origen:</th>
        <td>ORDEN DE TALLER</td>
      </tr>
      : <tr>
        <th>Vale #:</th>
        <td>{voucherConsecutive}</td>
      </tr>

    const seller = Object.keys(user).length !== 0
      ? cashierName
      : 'Cajero Por Defecto'
    return <div style={dataStyles}>

      <table>
        <tbody>
          <tr style={trStyles}>
            <th style={thStyles}>Fecha:</th>
            <td style={tdStyles}>{date}</td>
          </tr>
          <tr style={trStyles}>
            <th style={thStyles}>Adel #:</th>
            <td style={tdStyles}>{consecutive}</td>
          </tr>
          {workOrderOrVoucher}
          <tr style={trStyles}>
            <th style={thStyles}>Cliente:</th>
            <td style={tdStyles}>{client}</td>
          </tr>

          <tr style={trStyles}>
            <th style={thStyles}>Cajero:</th>
            <td style={tdStyles}>{seller}</td>
          </tr>

        </tbody>

      </table>

    </div>

  }

}
