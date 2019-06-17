/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {loadSaleToReprint} from '../../../../../general/reprintInvoice/actions'
import {loadReturnToPrint} from '../../../../../general/printReturn/actions'

@connect((store) => {
  return {
    document: store.documentDetail.activeDocument,
    userProfile: store.userProfile.profile
  }
})
export default class Documents extends React.Component {

  reprintInvoice() {
    this.props.dispatch(loadSaleToReprint(this.props.document.sale_consecutive))
  }

  printReturn() {
    this.props.dispatch(loadReturnToPrint(this.props.document.sale_consecutive))
  }

  getDocLinks(model) {
    switch (model) {
      case 'invoice':
      {
        return {
          pdfURL: `/media/electronic_bills/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_signed.pdf`,
          xmlURL: `/media/electronic_bills/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_signed.xml`,
          responseURL: `/media/electronic_bills/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_response.xml`
        }
      }
      case 'ticket':
      {
        return {
          pdfURL: `/media/electronic_tickets/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_signed.pdf`,
          xmlURL: `/media/electronic_tickets/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_signed.xml`,
          responseURL: `/media/electronic_tickets/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_response.xml`
        }
      }
      case 'creditnote':
      {
        return {
          pdfURL: `/media/electronic_credit_notes/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_signed.pdf`,
          xmlURL: `/media/electronic_credit_notes/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_signed.xml`,
          responseURL: `/media/electronic_credit_notes/signed/${this.props.userProfile.tax_payer_id}/${this.props.document.numeric_key}_response.xml`
        }
      }
      case 'purchase':
      {
        break
      }
    }
  }

  getDocsToShow(model, urls) {
    switch (model) {
      case 'invoice':
      case 'ticket':
      {
        return <tbody>
          <tr>
            <th>Venta Interna:</th>
            <td className='invoiceRow'>
              <div className='invoiceRow-container' onClick={this.reprintInvoice.bind(this)}>
                <i className='fa fa-file-text-o' />
                Ver
              </div>
            </td>
          </tr>
          <tr>
            <th>PDF:</th>
            <td className='pdfRow'>
              <a download={`${this.props.document.consecutive_numbering}.pdf`} href={urls.pdfURL}>
                <i className='fa fa-file-pdf-o' />
                Descargar
              </a>
            </td>
          </tr>
          <tr>
            <th>XML</th>
            <td className='xmlRow'>
              <a download={`${this.props.document.consecutive_numbering}.xml`} href={urls.xmlURL}>
                <i className='fa fa-file-code-o' />
                Descargar
              </a>
            </td>
          </tr>
          <tr>
            <th>Respuesta Hacienda</th>
            <td className='responseRow'>
              <a download={`${this.props.document.consecutive_numbering}.xml`} href={urls.responseURL}>
                <i className='fa fa-file-code-o' />
                Descargar
              </a>
            </td>
          </tr>
        </tbody>
      }
      case 'creditnote':
      {
        return <tbody>
          <tr>
            <th>Nota Interna:</th>
            <td className='invoiceRow'>
              {/* <div className='invoiceRow-container' onClick={this.printReturn.bind(this)}> */}
              <div className='invoiceRow-container'>
                <i className='fa fa-file-text-o' />
                Ver
              </div>
            </td>
          </tr>
          <tr>
            <th>PDF:</th>
            <td className='pdfRow'>
              <a download={`${this.props.document.consecutive_numbering}.pdf`} href={urls.pdfURL}>
                <i className='fa fa-file-pdf-o' />
                Descargar
              </a>
            </td>
          </tr>
          <tr>
            <th>XML</th>
            <td className='xmlRow'>
              <a download={`${this.props.document.consecutive_numbering}.pdf`} href={urls.xmlURL}>
                <i className='fa fa-file-code-o' />
                Descargar
              </a>
            </td>
          </tr>
          <tr>
            <th>Respuesta Hacienda</th>
            <td className='responseRow'>
              <a download={`${this.props.document.consecutive_numbering}.pdf`} href={urls.responseURL}>
                <i className='fa fa-file-code-o' />
                Descargar
              </a>
            </td>
          </tr>
        </tbody>
      }
      case 'purchase':
      {
        break
      }
    }

  }

  // Main Layout
  render() {

    const model = this.props.model

    const urls = this.getDocLinks(model)
    const tBody = this.getDocsToShow(model, urls)
    return <div className='documentDetail-documents'>

      <div className='admin-invoicing-detail-header'>
        DOCUMENTOS
      </div>

      <table className=' table documentDetail-documents-table'>
        {tBody}
      </table>

    </div>

  }

}
