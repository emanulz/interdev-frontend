import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {determinClientName, determinClientLastName} from '../../../../apps/sales/general/clients/actions.js'

@connect((store) => {
  return {
    sale: store.printPresale.presale,
    presale: store.printPresale.presale
  }
})
export default class Data extends React.Component {

  render() {

    const sale = this.props.sale
    const presale = this.props.presale
    const presaleUser = Object.keys(presale).length > 0 ? presale.user : ''

    const date = sale.created
      ? `${formatDateTimeAmPm(sale.created)}`
      : `${formatDateTimeAmPm(new Date())}`

    const presellerName = presaleUser.first_name
      ? `${presaleUser.first_name} ${presaleUser.last_name}`
      : presaleUser.length ? `${presaleUser.username}` : ''

    const id = sale.consecutive ? sale.consecutive : '0001'

    const seller = Object.keys(presaleUser).length !== 0
      ? presellerName
      : 'Cajero Predeterminado'

    // DETERMIN THE NAME AND LASTNAME OF CLIENT BASED ON CLIENT CODE ANS EXTRAS
    let extras = {
      notes: '',
      client: {
        last_name: 'General',
        name: 'Cliente',
        email: ''
      }
    }
    try {
      extras = presale.extras ? JSON.parse(presale.extras) : extras
    } catch (err) { console.log('ERROR PARSE', err) }
    const client = presale.client ? `${presale.client.code} - ${determinClientName(presale.client, extras.client)} ${determinClientLastName(presale.client, extras.client)}` : '00 - Cliente General'

    return <div className='reprint-full-presale-data'>

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
