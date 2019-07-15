import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'

@connect((store) => {
  return {
    request: store.printRequest.request
  }
})
export default class Data extends React.Component {

  render() {

    const request = this.props.request
    const requestUser = Object.keys(request).length > 0 ? request.user : ''

    const date = request.created
      ? `${formatDateTimeAmPm(request.created)}`
      : `${formatDateTimeAmPm(new Date())}`

    const presellerName = requestUser.first_name
      ? `${requestUser.first_name} ${requestUser.last_name}`
      : requestUser.length ? `${requestUser.username}` : ''

    const id = request.consecutive ? request.consecutive : '0001'

    const seller = Object.keys(requestUser).length !== 0
      ? presellerName
      : 'Cajero Predeterminado'

    const supplier = request.supplier ? `${request.supplier.code} - ${request.supplier.name}` : '00 - Proveedor No Asignado'

    return <div className='reprint-full-request-data'>

      <table className='supplier-table'>
        <thead>
          <tr>
            <th>PROVEEDOR:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{supplier}</td>
          </tr>
          <tr>
            <td>Usuario: {seller}</td>
          </tr>
        </tbody>

      </table>
      <table className='datenum-table'>

        <tbody>
          <tr>
            <th>N. de Orden:</th>
            <td>{('00000' + id).slice(-5)}</td>

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
