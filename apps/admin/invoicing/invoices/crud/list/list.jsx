/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../../../utils/api.js'
import Pagination from '../../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../../general/pagination/resultsPerPage.jsx'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    einvoices: store.einvoices.einvoices,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults,
    userProfile: store.userProfile.profile
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_EINVOICE', payload: ''})
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const clientKwargs = {
      url: `/api/electronicinvoice/?limit=${this.props.pageSize}`,
      successType: 'FETCH_EINVOICES_FULFILLED',
      errorType: 'FETCH_EINVOICES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(clientKwargs))
  }

  render() {

    const headerOrder = [
      {
        field: 'consecutive_numbering',
        text: 'Consecutivo',
        type: 'text'
      }, {
        field: 'updated',
        text: 'Fecha Modificación',
        type: 'date'
      }, {
        field: 'process_status',
        text: 'Estado del Proceso'
      }, {
        field: 'numeric_key',
        text: 'PDF',
        type: 'PDF',
        base_url: `/media/electronic_bills/signed/${this.props.userProfile.tax_payer_id}`,
        idField: 'consecutive_numbering'
      }, {
        field: 'numeric_key',
        text: 'XML',
        type: 'XML',
        base_url: `/media/electronic_bills/signed/${this.props.userProfile.tax_payer_id}`,
        idField: 'consecutive_numbering'
      }, {
        field: 'numeric_key',
        text: 'Respuesta',
        type: 'XML_HACIENDA',
        base_url: `/media/electronic_bills/signed/${this.props.userProfile.tax_payer_id}`,
        idField: 'consecutive_numbering'
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.einvoices
    const list = <AdminTable headerOrder={headerOrder} model='invoice' data={tableData}
      idField='id' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/electronicinvoice/' successType='FETCH_EINVOICES_FULFILLED' errorType='FETCH_EINVOICES_REJECTED' />
        <Pagination url='/api/electronicinvoice/' successType='FETCH_EINVOICES_FULFILLED' errorType='FETCH_EINVOICES_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Facturas Electrónicas:</h1>
      </div>
      {/* <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div> */}
      <SearchAdmin model='electronicTicket' namespace='adminSearch' />
      {paginationDiv}
      {/* <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/clients/' successType='FETCH_EINVOICES_FULFILLED' errorType='FETCH_EINVOICES_REJECTED' />
        <Pagination url='/api/clients/' successType='FETCH_EINVOICES_FULFILLED' errorType='FETCH_EINVOICES_REJECTED' />
      </div> */}
      {content}
    </div>

  }

}
