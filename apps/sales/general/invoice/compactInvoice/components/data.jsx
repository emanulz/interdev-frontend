import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../../../utils/formatDate.js'

@connect((store) => {
  return {sale: store.sales.saleActive, presaleUser: store.presales.presaleUser, user: store.user.user}
})
export default class Data extends React.Component {

  render() {
    const sale = this.props.sale
    const date = sale.created
      ? `${formatDateTimeAmPm(sale.created)}`
      : '01/01/1970'
    const cashierName = this.props.user.first_name
      ? `${this.props.user.first_name} ${this.props.user.last_name}`
      : `${this.props.user.username}`
    const presellerName = this.props.presaleUser.first_name
      ? `${this.props.presaleUser.first_name} ${this.props.presaleUser.last_name}`
      : `${this.props.presaleUser.username}`
    const client = sale.client ? `${sale.client.code} - ${sale.client.name} ${sale.client.last_name}` : '00 - Cliente de Contado'
    const id = sale.consecutive ? sale.consecutive : '0001'
    const seller = Object.keys(this.props.presaleUser).length !== 0
      ? presellerName
      : cashierName

    return <div className='compact-invoice-data'>

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
