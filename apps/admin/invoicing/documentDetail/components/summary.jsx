/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getElementStatus} from './actions.js'

@connect((store) => {
  return {
    document: store.documentDetail.activeDocument,
    userProfile: store.userProfile.profile
  }
})
export default class Summary extends React.Component {

  determinModelSaleText(model) {
    switch (model) {
      case 'invoice':
      case 'ticket':
      {
        return 'Venta Interna #'
      }
      case 'creditnote':
      {
        return 'NC Interna #'
      }
      case 'purchase':
      {
        return 'Compra Interna #'
      }
    }
  }

  // Main Layout
  render() {

    const modelText = this.props.modelText
    const model = this.props.model
    let totalObject = {}

    try {
      totalObject = JSON.parse(this.props.document.sale_total)
    } catch (err) {}

    const symbol = totalObject.currency
      ? (totalObject.currency == 'USD') ? '$' : (totalObject.currency == 'CRC') ? '₡' : ''
      : ''
    const client = this.props.document ? this.props.document.client_name : ''
    const saleTotal = totalObject.total
      ? parseFloat(totalObject.total)
      : 0
    const status = getElementStatus(this.props.document)
    const cell = <td className={status.className}>{status.text}</td>
    const rejectReasonRow = status.className == 'rejected'
      ? <tr>
        <th>Razón de Rechazo:</th>
        <td>MIRAR XML RESPUESTA</td>
      </tr>
      : <tr />

    const saleText = this.determinModelSaleText(model)

    return <div className='documentDetail-sumary'>
      <div className='admin-invoicing-detail-header'>
        RESUMEN
      </div>

      <table className=' table documentDetail-sumary-table'>
        <tbody>
          <tr>
            <th>Tipo de Documento:</th>
            <td>{modelText}</td>
          </tr>
          <tr>
            <th>Consecutivo:</th>
            <td>{this.props.document.consecutive_numbering}</td>
          </tr>
          <tr>
            <th>{saleText}:</th>
            <td>{this.props.document.sale_consecutive}</td>
          </tr>
          <tr>
            <th>Cliente:</th>
            <td>{client}</td>
          </tr>
          <tr>
            <th>Monto:</th>
            <td className='price'>{symbol} {saleTotal.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr>
            <th>Versión XML:</th>
            <td>{this.props.document.hacienda_resolution}</td>
          </tr>
          <tr>
            <th>Estado proceso:</th>
            <td>{this.props.document.process_status}</td>
          </tr>
          <tr>
            <th>Estado Hacienda:</th>
            {cell}
          </tr>
          {rejectReasonRow}
        </tbody>
      </table>

    </div>

  }

}
