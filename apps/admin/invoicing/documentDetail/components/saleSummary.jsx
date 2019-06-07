/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    document: store.documentDetail.activeDocument,
    userProfile: store.userProfile.profile
  }
})
export default class SaleSummary extends React.Component {

  // Main Layout
  render() {

    const modelText = this.props.modelText
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
    const pdfURL = `/media/electronic_bills/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_signed.pdf`
    const xmlURL = `/media/electronic_bills/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_signed.xml`
    const responseURL = `/media/electronic_bills/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_response.xml`
    return <div className='documentDetail-sumary'>
      <div className='documentDetail-sumary-header'>
        RESUMEN
      </div>

      <table className=' table documentDetail-sumary-table'>
        <tbody>
          <tr>
            <th>Tipo de Documento:</th>
            <td>{modelText}</td>
          </tr>
          <tr>
            <th>Venta Interna #:</th>
            <td>{this.props.document.sale_consecutive}</td>
          </tr>
          <tr>
            <th>Cliente:</th>
            <td>{client}</td>
          </tr>
          <tr>
            <th>Total Venta:</th>
            <td className='price'>{symbol} {saleTotal.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr>
            <th>Estado Hacienda:</th>
            <td>Aceptado</td>
          </tr>
        </tbody>
      </table>

      <div className='documentDetail-sumary-header'>
        DOCUMENTOS
      </div>

      <table className=' table documentDetail-sumary-table'>
        <tbody>
          <tr>
            <th>Venta Interna:</th>
            <td className='invoiceRow'>
              <i className='fa fa-file-text-o' />
              Ver
            </td>
          </tr>
          <tr>
            <th>PDF:</th>
            <td className='pdfRow'>
              <a download={`${this.props.document.consecutive_numbering}.pdf`} href={pdfURL}>
                <i className='fa fa-file-pdf-o' />
                Descargar
              </a>
            </td>
          </tr>
          <tr>
            <th>XML</th>
            <td className='xmlRow'>
              <a download={`${this.props.document.consecutive_numbering}.pdf`} href={xmlURL}>
                <i className='fa fa-file-code-o' />
                Descargar
              </a>
            </td>
          </tr>
          <tr>
            <th>Respuesta Hacienda</th>
            <td className='responseRow'>
              <a download={`${this.props.document.consecutive_numbering}.pdf`} href={responseURL}>
                <i className='fa fa-file-code-o' />
                Descargar
              </a>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

  }

}
