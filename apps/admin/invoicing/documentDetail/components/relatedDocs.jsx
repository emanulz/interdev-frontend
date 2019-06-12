/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    document: store.documentDetail.activeDocument,
    userProfile: store.userProfile.profile,
    relatedCreditNotes: store.documentDetail.relatedCreditNotes,
    relatedDebitNotes: store.documentDetail.relatedDebitNotes,
    relatedInvoices: store.documentDetail.relatedInvoices,
    relatedTickets: store.documentDetail.relatedTickets
  }
})
export default class RelatedDocs extends React.Component {

  getRelatedCreditNotes() {
    const CNToRender = this.props.relatedCreditNotes.map(item => {
      const amounts = JSON.parse(item.sale_total)
      const symbol = amounts.currency == 'USD' ? '$' : '₡'
      return <div key={item.id} className='relatedDoc'>
        <div className='relatedDoc-tittle'>
          <span>Nota de Crédito Electrónica</span>
        </div>
        <div className='relatedDoc-body'>
          <div className='relatedDoc-body-data'>
            <span><b>Consecutivo:</b> {item.consecutive_numbering}</span>
            <span><b>Interno:</b> {item.sale_consecutive}</span>
            <span><b>Cliente:</b> {item.client_name}</span>
            <span><b>Monto:</b> {symbol}{parseFloat(amounts.total).formatMoney(2, ',', '.')}</span>
          </div>
          <div className='relatedDoc-body-link'>
            <a target='_blank' href={`/admin/invoicing/detail/creditnote/${item.consecutive_numbering}`}>Detalle</a>
          </div>
        </div>
      </div>
    })

    return CNToRender
  }

  getRelatedInvoices() {
    const invoicesToRender = this.props.relatedInvoices.map(item => {
      const amounts = JSON.parse(item.sale_total)
      const symbol = amounts.currency == 'USD' ? '$' : '₡'
      return <div key={item.id} className='relatedDoc'>
        <div className='relatedDoc-tittle'>
          <span>Factura Electrónica</span>
        </div>
        <div className='relatedDoc-body'>
          <div className='relatedDoc-body-data'>
            <span><b>Consecutivo:</b> {item.consecutive_numbering}</span>
            <span><b>Interno:</b> {item.sale_consecutive}</span>
            <span><b>Cliente:</b> {item.client_name}</span>
            <span><b>Monto:</b> {symbol}{parseFloat(amounts.total).formatMoney(2, ',', '.')}</span>
          </div>
          <div className='relatedDoc-body-link'>
            <a target='_blank' href={`/admin/invoicing/detail/invoice/${item.consecutive_numbering}`}>Detalle</a>
          </div>
        </div>
      </div>
    })

    return invoicesToRender
  }

  getRelatedTickets() {
    const ticketsToRender = this.props.relatedTickets.map(item => {
      const amounts = JSON.parse(item.sale_total)
      const symbol = amounts.currency == 'USD' ? '$' : '₡'
      return <div key={item.id} className='relatedDoc'>
        <div className='relatedDoc-tittle'>
          <span>Tiquete Electrónico</span>
        </div>
        <div className='relatedDoc-body'>
          <div className='relatedDoc-body-data'>
            <span><b>Consecutivo:</b> {item.consecutive_numbering}</span>
            <span><b>Interno:</b> {item.sale_consecutive}</span>
            <span><b>Cliente:</b> {item.client_name}</span>
            <span><b>Monto:</b> {symbol}{parseFloat(amounts.total).formatMoney(2, ',', '.')}</span>
          </div>
          <div className='relatedDoc-body-link'>
            <a target='_blank' href={`/admin/invoicing/detail/ticket/${item.consecutive_numbering}`}>Detalle</a>
          </div>
        </div>
      </div>
    })

    return ticketsToRender
  }

  // Main Layout
  render() {
    const creditNotes = this.getRelatedCreditNotes()
    const tickets = this.getRelatedTickets()
    const invoices = this.getRelatedInvoices()
    return <div className='documentDetail-related'>

      <div className='admin-invoicing-detail-header'>
        RELACIONADOS
      </div>

      <div className='documentDetail-related-body'>
        {creditNotes}
        {tickets}
        {invoices}
      </div>

      {/* <table className=' table documentDetail-related-table'>
        <tbody>

        </tbody>
      </table> */}

    </div>

  }

}
