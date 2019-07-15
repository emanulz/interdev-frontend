import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'

@connect((store) => {
  return {
    order: store.printOrder.order
  }
})
export default class Data extends React.Component {

  render() {

    const order = this.props.order
    const orderUser = Object.keys(order).length > 0 ? order.user : ''

    const date = order.created
      ? `${formatDateTimeAmPm(order.created)}`
      : `${formatDateTimeAmPm(new Date())}`

    const presellerName = orderUser.first_name
      ? `${orderUser.first_name} ${orderUser.last_name}`
      : orderUser.length ? `${orderUser.username}` : ''

    const id = order.consecutive ? order.consecutive : '0001'

    const seller = Object.keys(orderUser).length !== 0
      ? presellerName
      : 'Cajero Predeterminado'

    const supplier = order.supplier ? `${order.supplier.code} - ${order.supplier.name}` : '00 - Proveedor No Asignado'

    return <div className='reprint-full-order-data'>

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
