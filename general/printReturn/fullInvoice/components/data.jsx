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
    // const user = returnObject.user ? returnObject.user : ''
    const voucher = this.props.voucher

    const date = returnObject.created
      ? `${formatDateTimeAmPm(returnObject.created)}`
      : `${formatDateTimeAmPm(new Date())}`
    // const cashierName = user.first_name
    //   ? `${user.first_name} ${user.last_name}`
    //   : user.length ? `${user.username}` : ''

    const client = returnObject.client ? `${returnObject.client.code} - ${returnObject.client.name} ${returnObject.client.last_name}` : '00 - Cliente de Contado'
    const saleId = returnObject.sale_consecutive ? returnObject.sale_consecutive : '0001'
    // const returnId = returnObject.consecutive ? returnObject.consecutive : '0001'
    const creditNoteId = creditNote.consecutive ? creditNote.consecutive : '0001'

    const voucherRow = this.props.voucher.consecutive
      ? <tr>
        <th>Vale #:</th>
        <td>{voucher.consecutive}</td>
      </tr>
      : <tr />

    return <div className='print-return-full-invoice-data'>
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
            <th>N. de Nota:</th>
            <td>{creditNoteId}</td>
          </tr>
          {voucherRow}
          <tr>
            <th>Fecha:</th>
            <td>{date}</td>
          </tr>
          <tr>
            <th>Factura de venta:</th>
            <td>{saleId}</td>
          </tr>
        </tbody>

      </table>

    </div>

  }

}
