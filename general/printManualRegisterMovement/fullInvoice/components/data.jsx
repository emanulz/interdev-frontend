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

    const seller = Object.keys(user).length !== 0
      ? cashierName
      : 'Cajero Por Defecto'

    return <div className='cash-advance-full-invoice-data'>

      <table className='client-table'>
        <thead>
          <tr>
            <th>CLIENTE:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{client}</td>
          </tr>
        </tbody>

      </table>
      <table className='datenum-table'>

        <tbody>
          <tr>
            <th>Adel #:</th>
            <td>{consecutive}</td>
          </tr>
          <tr>
            <th>Vale #:</th>
            <td>{voucherConsecutive}</td>
          </tr>
          <tr>
            <th>Fecha:</th>
            <td>{date}</td>
          </tr>
        </tbody>

      </table>

    </div>

  }

}
