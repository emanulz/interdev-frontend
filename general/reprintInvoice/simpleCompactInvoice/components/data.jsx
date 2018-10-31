import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {determinClientName, determinClientLastName} from '../../../../apps/sales/general/clients/actions.js'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    presale: store.reprintInvoice.presale,
    ticket: store.reprintInvoice.ticket,
    invoice: store.reprintInvoice.invoice,
    taxPayer: store.userProfile.taxPayer,
    receiptStyles: store.config.receiptStyles
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

    const fontFamily = this.props.receiptStyles.simpleCompactInvoiceFont ? this.props.receiptStyles.simpleCompactInvoiceFont : 'Arial'
    const fontSize = this.props.receiptStyles.simpleCompactInvoiceFontSize ? this.props.receiptStyles.simpleCompactInvoiceFontSize : '10px'
    const dataStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold'
    }

    return <div style={dataStyles}>

      <table>
        <tbody>
          <tr>
            <th>Fecha:</th>
            <td>{date}</td>
          </tr>
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
