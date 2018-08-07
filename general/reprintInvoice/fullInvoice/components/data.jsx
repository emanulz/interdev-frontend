import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    presale: store.reprintInvoice.presale
  }
})
export default class Data extends React.Component {

  render() {

    const sale = this.props.sale
    const presale = this.props.presale
    const user = Object.keys(sale).length > 0 ? sale.user : ''
    const presaleUser = Object.keys(presale).length > 0 ? presale.user : ''

    const date = sale.created
      ? `${formatDateTimeAmPm(sale.created)}`
      : `${formatDateTimeAmPm(new Date())}`
    const cashierName = user.first_name
      ? `${user.first_name} ${user.last_name}`
      : user.length ? `${user.username}` : ''

    const presellerName = presaleUser.first_name
      ? `${presaleUser.first_name} ${presaleUser.last_name}`
      : presaleUser.length ? `${presaleUser.username}` : ''
    const client = sale.client ? `${sale.client.code} - ${sale.client.name} ${sale.client.last_name}` : '00 - Cliente de Contado'
    const id = sale.consecutive ? sale.consecutive : '0001'

    const seller = Object.keys(presaleUser).length !== 0
      ? presellerName
      : cashierName

    return <div className='reprint-full-invoice-data'>

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
            <th>N. de factura:</th>
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
