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
    config: store.config.globalConf
  }
})
export default class Data extends React.Component {

  render() {

    const sale = this.props.sale
    const presale = this.props.presale
    const user = Object.keys(sale).length > 0 ? sale.user : ''
    const presaleUser = Object.keys(presale).length > 0 ? presale.user : ''

    let wasCredit = false
    try {
      wasCredit = this.props.sale.pay.cred[0].amount
    } catch (err) {}

    const conditionText = wasCredit ? 'Crédito' : 'Contado'

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
    } catch (err) { console.log('EXTRAS ERROR PARSE', err) }
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

    const numKeyRow = this.props.taxPayer.is_digital_invoicing_active
      ? <tr>
        <th>Clave:</th>
        <td className='numeric-key-full'>{numericKey}</td>
      </tr>
      : <tr />

    const sellerRow = this.props.config.printSellerInFullInvoice
      ? <tr>
        <td>Vendedor: {seller}</td>
      </tr>
      : <tr />
    const clientIDRow = this.props.config.printClientIDInFullInvoice
      ? <tr>
        <td>Identif: {sale.client ? sale.client.id_num : ''}</td>
      </tr>
      : <tr />

    const clientEmailRow = this.props.config.printClientEmailInFullInvoice
      ? <tr>
        <td>Email: {sale.client ? sale.client.email : ''}</td>
      </tr>
      : <tr />

    const payMethodRow = this.props.config.printPayMethodInFullInvoice
      ? <tr>
        <th>Pago:</th>
        <td>Transferencia / Depósito Bancario</td>
      </tr>
      : <tr />

    const saleConditionRow = this.props.config.printSaleConditionInFullInvoice
      ? <tr>
        <th>Condición:</th>
        <td>{conditionText}</td>
      </tr>
      : <tr />

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
          {clientIDRow}
          {sellerRow}
          {clientEmailRow}
        </tbody>

      </table>
      <table className='datenum-table'>
        <tbody>
          <tr>
            <th>Factura:</th>
            <td>{('00000' + id).slice(-5)}</td>
          </tr>
          {docTypeRow}
          <tr>
            <th>Fecha:</th>
            <td>{date}</td>
          </tr>
          {longConsecRow}
          {numKeyRow}
          {payMethodRow}
          {saleConditionRow}
        </tbody>

      </table>

    </div>

  }

}
