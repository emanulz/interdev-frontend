import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'

@connect((store) => {
  return {
    returnObject: store.printReturn.return_object
  }
})
export default class Data extends React.Component {

  render() {
    const returnObject = this.props.returnObject
    const user = Object.keys(returnObject).length > 0 ? returnObject.user : ''

    const date = returnObject.created
      ? `${formatDateTimeAmPm(returnObject.created)}`
      : `${formatDateTimeAmPm(new Date())}`
    const cashierName = user.first_name
      ? `${user.first_name} ${user.last_name}`
      : user.length ? `${user.username}` : ''

    const client = returnObject.client ? `${returnObject.client.code} - ${returnObject.client.name} ${returnObject.client.last_name}` : '00 - Cliente de Contado'
    const id = returnObject.consecutive ? returnObject.consecutive : '0001'

    const seller = cashierName

    return <div className='print-return-compact-invoice-data'>

      <table className='datenum-table'>
        <tbody>
          <tr>
            <th>Fecha:</th>
            <td>{date}</td>
          </tr>
          <tr>
            <th>Factura:</th>
            <td>{id}</td>

          </tr>
          <tr>
            <th>Cliente:</th>
            <td>{client}</td>
          </tr>

          <tr>
            <th>Vendedor:</th>
            <td>{seller}</td>
          </tr>

        </tbody>

      </table>

    </div>

  }

}
