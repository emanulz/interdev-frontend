import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'

@connect((store) => {
  return {
    returnObject: store.printReturn.return_object,
    creditNote: store.printReturn.credit_note,
    voucher: store.printReturn.voucher
  }
})
export default class Data extends React.Component {

  render() {
    const returnObject = this.props.returnObject
    const creditNote = this.props.creditNote
    const voucher = this.props.voucher
    const user = returnObject.user ? returnObject.user : ''
    const date = returnObject.created
      ? `${formatDateTimeAmPm(returnObject.created)}`
      : `${formatDateTimeAmPm(new Date())}`
    const cashierName = user.first_name
      ? `${user.first_name} ${user.last_name}`
      : user.length ? `${user.username}` : ''

    const client = returnObject.client ? `${returnObject.client.code} - ${returnObject.client.name} ${returnObject.client.last_name}` : '00 - Cliente de Contado'
    const saleId = returnObject.sale_consecutive ? returnObject.sale_consecutive : '0001'
    // const returnId = returnObject.consecutive ? returnObject.consecutive : '0001'
    const creditNoteId = creditNote.consecutive ? creditNote.consecutive : '0001'
    const seller = cashierName

    const voucherRow = this.props.voucher.consecutive
      ? <tr>
        <th>Vale #:</th>
        <td>{voucher.consecutive}</td>
      </tr>
      : <tr />

    return <div className='print-return-compact-invoice-data'>

      <table className='datenum-table'>
        <tbody>
          <tr>
            <th>Fecha:</th>
            <td>{date}</td>
          </tr>
          <tr>
            <th>N.Cred #:</th>
            <td>{creditNoteId}</td>
          </tr>
          {voucherRow}
          <tr>
            <th>Factura Venta:</th>
            <td>{saleId}</td>
          </tr>
          <tr>
            <th>Cliente:</th>
            <td>{client}</td>
          </tr>
          <tr>
            <th>Cajero:</th>
            <td>{seller}</td>
          </tr>

        </tbody>

      </table>

    </div>

  }

}
