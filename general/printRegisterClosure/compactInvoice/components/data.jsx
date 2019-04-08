import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'

@connect((store) => {
  return {
    registerClosure: store.printRegisterClosure.registerClosure
  }
})
export default class Data extends React.Component {

  render() {
    const registerClosure = this.props.registerClosure

    const date = registerClosure.created
      ? `${formatDateTimeAmPm(registerClosure.created)}`
      : `${formatDateTimeAmPm(new Date())}`
    const date2 = registerClosure.updated
      ? `${formatDateTimeAmPm(registerClosure.updated)}`
      : `${formatDateTimeAmPm(new Date())}`
    const cashierName = registerClosure.cashier_name

    const closureId = registerClosure.id ? registerClosure.id : '0001'
    const seller = cashierName

    return <div className='print-register-closure-compact-invoice-data'>

      <table className='datenum-table'>
        <tbody>
          <tr>
            <th>Fecha Apertura:</th>
            <td>{date}</td>
          </tr>
          <tr>
            <th>Fecha Cierre:</th>
            <td>{date2}</td>
          </tr>
          <tr>
            <th>Cierre #:</th>
            <td>{closureId}</td>
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
