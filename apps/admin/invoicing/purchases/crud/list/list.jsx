/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../../../utils/api.js'
import {Link} from 'react-router-dom'
import Pagination from '../../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../../general/pagination/resultsPerPage.jsx'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    purchases: store.epurchases.epurchases,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults,
    userProfile: store.userProfile.profile
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_EPURCHASES', payload: ''})
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const clientKwargs = {
      url: `/api/receivedelectronicdoc/?limit=${this.props.pageSize}`,
      successType: 'FETCH_EPURCHASES_FULFILLED',
      errorType: 'FETCH_EPURCHASES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(clientKwargs))
  }

  render() {

    const getStatus = (item) => {
      function getElementStatus(item) {
        const splittedHistory = item.process_history.split('_')
        let text = 'PROCESANDO'
        let className = 'processing'
        const accepted = splittedHistory.find((el) => { return el == '4' })
        const rejected = splittedHistory.find((el) => {
          const num = parseInt(el)
          return !accepted && num >= 5
        })
        if (accepted) {
          text = 'ACEPTADO'
          className = 'accepted'
        }

        if (rejected) {
          text = 'RECHAZADO'
          className = 'rejected'
        }

        return <span className={className}>{text}</span>
      }
      return getElementStatus(item)
    }

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
        field: 'id',
        type: 'function_element',
        idField: 'id',
        worker_method: getStatus,
        text: 'Estado Hacienda'
      }, {
        field: 'numeric_key',
        text: 'XML',
        type: 'XML',
        base_url: `/media/purchases/signed/${this.props.userProfile.tax_payer_id}`,
        idField: 'consecutive_numbering'
      }, {
        field: 'numeric_key',
        text: 'Respuesta',
        type: 'XML_HACIENDA',
        base_url: `/media/purchases/signed/${this.props.userProfile.tax_payer_id}`,
        idField: 'consecutive_numbering'
      }, {
        field: 'id',
        type: 'RESET_HUMAN',
        idField: 'id',
        text: 'Reintentar'
      }
    ]
    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.purchases
    const list = <AdminTable headerOrder={headerOrder} model='clients' data={tableData}
      idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/invoicing/purchases/accept'}>
      <span className='fa fa-plus' />
      Aceptar
    </Link>

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/receivedelectronicdoc/' successType='FETCH_EPURCHASES_FULFILLED' errorType='FETCH_EPURCHASES_REJECTED' />
        <Pagination url='/api/receivedelectronicdoc/' successType='FETCH_EPURCHASES_FULFILLED' errorType='FETCH_EPURCHASES_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Compras:</h1>
        {addLink}
      </div>
      {/* <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div> */}
      <SearchAdmin model='client' namespace='adminSearch' />
      {paginationDiv}
      {/* <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/receivedelectronicdoc/' successType='FETCH_EPURCHASES_FULFILLED' errorType='FETCH_EPURCHASES_REJECTED' />
        <Pagination url='/api/receivedelectronicdoc/' successType='FETCH_EPURCHASES_FULFILLED' errorType='FETCH_EPURCHASES_REJECTED' />
      </div> */}
      {content}
    </div>

  }

}
