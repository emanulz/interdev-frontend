import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm, formatDate} from '../../../../utils/formatDate.js'
import {determinClientName, determinClientLastName} from '../../../../apps/sales/general/clients/actions.js'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    presale: store.reprintInvoice.presale,
    ticket: store.reprintInvoice.ticket,
    invoice: store.reprintInvoice.invoice,
    taxPayer: store.userProfile.taxPayer,
    config: store.config.globalConf
  }
})
export default class Data extends React.Component {

  addDate(date, days) {
    const retDate = new Date(date)
    retDate.setDate(retDate.getDate() + days)
    return retDate
  }

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

    let wasCredit = false
    try {
      wasCredit = this.props.sale.pay.cred[0].amount
    } catch (err) {}

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
    const client = sale.client ? `${sale.client.code} - ${determinClientName(sale.client, extras.client, sale.local_data)} ${determinClientLastName(sale.client, extras.client, sale.local_data)}` : '00 - Cliente General'

    const ticket = this.props.ticket
    const invoice = this.props.invoice
    let numericKey = ''
    let numericKey1 = ''
    let numericKey2 = ''
    let longConsecutive = ''
    let documentType = ''
    try {
      if (invoice) {
        numericKey = invoice.numeric_key
        try {
          numericKey1 = numericKey.substr(0, 21)
          numericKey2 = numericKey.substr(21, 50)
        } catch (err) {}
        longConsecutive = invoice.consecutive_numbering
        documentType = 'Factura Electrónica'
      }
      if (ticket) {
        numericKey = ticket.numeric_key
        try {
          numericKey1 = numericKey.substr(0, 21)
          numericKey2 = numericKey.substr(21, 50)
        } catch (err) {}

        longConsecutive = ticket.consecutive_numbering
        documentType = 'Tiquete Electrónico'
      }
    } catch (err) {}

    const docTypeRow = this.props.taxPayer.is_digital_invoicing_active
      ? <tr>
        <th>Tipo:</th>
        <td>{documentType}</td>
      </tr>
      : <tr />

    const longConsecRow = this.props.taxPayer.is_digital_invoicing_active
      ? <tr>
        <th>Consec:</th>
        <td>{longConsecutive}</td>
      </tr>
      : <tr />

    const numKey1Row = this.props.taxPayer.is_digital_invoicing_active
      ? <tr>
        <th>Clave:</th>
        <td >{numericKey1}</td>
      </tr>
      : <tr />

    const numKey2Row = this.props.taxPayer.is_digital_invoicing_active
      ? <tr>
        <th />
        <td>{numericKey2}</td>
      </tr>
      : <tr />

    const createdDate = sale.created ? sale.created : new Date()
    const creditDays = extras.credit_days ? extras.credit_days : 0
    const dueDate = this.addDate(createdDate, creditDays)
    const saleDueDateRow = wasCredit && creditDays && this.props.config.printDueDateInInvoice > 0
      ? <tr>
        <th>Venc:</th>
        <td>{formatDate(dueDate)}</td>
      </tr>
      : <tr />
    return <div className='reprint-compact-invoice-data'>

      <table className='datenum-table'>
        <tbody>
          <tr>
            <th>Fecha:</th>
            <td>{date}</td>
          </tr>
          {saleDueDateRow}
          {docTypeRow}
          <tr>
            <th>Factura:</th>
            <td>{id}</td>
          </tr>
          {longConsecRow}
          {numKey1Row}
          {numKey2Row}
          <tr>
            <th>Cliente:</th>
            <td>{client}</td>
          </tr>

          <tr>
            <th>Vend:</th>
            <td>{seller}</td>
          </tr>

        </tbody>

      </table>

    </div>

  }

}
