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
    return <div className='cash-advance-compact-invoice-data'>

      <table className='datenum-table'>
        <tbody>
          <tr>
            <th>Fecha:</th>
            <td>{date}</td>
          </tr>
          <tr>
            <th>Adel #:</th>
            <td>{consecutive}</td>
          </tr>
          {workOrderOrVoucher}
          <tr>
            <th>Cliente:</th>
            <td>{client}</td>
          </tr>

          <tr>
            <th>Cajero:</th>
            <td>{seller}</td>
          </tr>

        </tbody>

      </table>

    </div>

  }

}
