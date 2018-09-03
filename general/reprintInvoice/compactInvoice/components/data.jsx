import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {determinClientName, determinClientLastName} from '../../../../apps/sales/general/clients/actions.js'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    presale: store.reprintInvoice.presale,
    ticket: store.reprintInvoice.ticket,
    invoice: store.reprintInvoice.invoice
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

    const id = sale.consecutive ? sale.consecutive : '0001'
    const seller = Object.keys(presaleUser).length !== 0
      ? presellerName
      : cashierName

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
      extras = sale.extras ? JSON.parse(sale.extras) : extras
    } catch (err) { console.log('ERROR PARSE', err) }
    const client = sale.client ? `${sale.client.code} - ${determinClientName(sale.client, extras.client)} ${determinClientLastName(sale.client, extras.client)}` : '00 - Cliente General'

    const ticket = this.props.ticket
    const invoice = this.props.invoice
    let numericKey = ''
    let longConsecutive = ''
    let documentType = ''
    try {
      if (invoice) {
        numericKey = invoice.numeric_key
        longConsecutive = invoice.consecutive_numbering
        documentType = 'Factura Electrónica'
      }
      if (ticket) {
        numericKey = ticket.numeric_key
        longConsecutive = ticket.consecutive_numbering
        documentType = 'Tiquete Electrónico'
      }
    } catch (err) {}

    return <div className='reprint-compact-invoice-data'>

      <table className='datenum-table'>
        <tbody>
          <tr>
            <th>Fecha:</th>
            <td>{date}</td>
          </tr>
          <tr>
            <th>Tipo:</th>
            <td>{documentType}</td>
          </tr>
          <tr>
            <th>Factura:</th>
            <td>{id}</td>
          </tr>
          <tr>
            <th>Consec:</th>
            <td>{longConsecutive}</td>
          </tr>
          <tr>
            <th>Clave:</th>
            <td className='numeric-key-compact'>{numericKey}</td>
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
