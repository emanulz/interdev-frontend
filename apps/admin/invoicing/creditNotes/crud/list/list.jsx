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
    ecreditNotes: store.ecreditNotes.ecreditNotes,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults,
    userProfile: store.userProfile.profile
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_ECREDIT_NOTES', payload: ''})
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const clientKwargs = {
      url: `/api/electroniccreditnote/?limit=${this.props.pageSize}&ordering=-created`,
      successType: 'FETCH_ECREDIT_NOTES_FULFILLED',
      errorType: 'FETCH_ECREDIT_NOTES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(clientKwargs))
  }

  render() {

    const getStatus = (item) => {
      function getElementStatus(item) {
        try {
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
        } catch (err) {
          return <span className='processing'>PROCESANDO</span>
        }
      }
      return getElementStatus(item)
    }

    const getTotal = (item) => {
      function getTotalToShow(item) {
        console.log('ITEMM', item)
        try {
          const obj = JSON.parse(item)
          if (obj.currency == 'CRC') {
            return `₡${parseFloat(obj.total).toFixed(2)}`
          }
          if (obj.currency == 'USD') {
            return `$${parseFloat(obj.total).toFixed(2)}`
          }
          return `${parseFloat(obj.total).toFixed(2)}`
        } catch (err) {
          console.log('ERRROR', err)
          return '0'
        }
      }
      return getTotalToShow(item)
    }

    const headerOrder = [
      {
        field: 'consecutive_numbering',
        text: 'Consecutivo',
        type: 'text'
      }, {
        field: 'created',
        text: 'Fecha Creación',
        type: 'date'
      }, {
        field: 'client_name',
        text: 'Cliente'
      }, {
        field: 'sale_total',
        text: 'Monto',
        type: 'function_process',
        worker_method: getTotal
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
        text: 'PDF',
        type: 'PDF',
        base_url: `/media/electronic_credit_notes/signed/${this.props.userProfile.tax_payer_id}`,
        idField: 'consecutive_numbering'
      }, {
        field: 'numeric_key',
        text: 'XML',
        type: 'XML',
        base_url: `/media/electronic_credit_notes/signed/${this.props.userProfile.tax_payer_id}`,
        idField: 'consecutive_numbering'
      }, {
        field: 'numeric_key',
        text: 'Respuesta',
        type: 'XML_HACIENDA',
        base_url: `/media/electronic_credit_notes/signed/${this.props.userProfile.tax_payer_id}`,
        idField: 'consecutive_numbering'
      }, {
        field: 'id',
        type: 'RESET_HUMAN',
        idField: 'id',
        text: 'Reintentar'
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.ecreditNotes
    const list = <AdminTable headerOrder={headerOrder} model='creditNote' data={tableData}
      idField='id' defaultDescending defaultSorting='created' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/electroniccreditnote/?ordering=-created' successType='FETCH_ECREDIT_NOTES_FULFILLED' errorType='FETCH_ECREDIT_NOTES_REJECTED' />
        <Pagination url='/api/electroniccreditnote/?ordering=-created' successType='FETCH_ECREDIT_NOTES_FULFILLED' errorType='FETCH_ECREDIT_NOTES_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Notas de Crédito Electrónicas:</h1>
      </div>
      <SearchAdmin model='electronicTicket' namespace='adminSearch' />
      {paginationDiv}
      {content}
    </div>

  }

}
