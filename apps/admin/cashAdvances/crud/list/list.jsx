/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'
import {loadCashAdvanceToPrint} from '../../../../../general/printCashAdvance/actions.js'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    cashAdvances: store.cashAdvances.cashAdvances,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_CASH_ADVANCE', payload: ''})
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const cashAdvanceKwargs = {
      url: `/api/cashadvances/?limit=${this.props.pageSize}&ordering=-created`,
      successType: 'FETCH_CASH_ADVANCES_FULFILLED',
      errorType: 'FETCH_CASH_ADVANCES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(cashAdvanceKwargs))
  }

  reprintCashAdvance(item) {
    this.props.dispatch(loadCashAdvanceToPrint(item))
  }

  render() {

    const getClientNameClosure = (item) => {
      function getName(item) {
        if (item == undefined || item.client == '') {
          return 'SIN NOMBRE'
        }
        try {
          const client = JSON.parse(item)
          return `${client.name} ${client.last_name}`
        } catch (err) { console.log(err) }
        return 'ERROR EN NOMBRE'
      }
      return getName(item)
    }

    const headerOrder = [
      {
        field: 'consecutive',
        text: 'Consecutivo'
      }, {
        type: 'function_process',
        field: 'client',
        text: 'Cliente',
        worker_method: getClientNameClosure
      }, {
        field: 'amount',
        text: 'Monto',
        type: 'price'
      }, {
        field: 'description',
        text: 'Descripción'
      }, {
        field: 'consecutive',
        text: 'Factura',
        type: 'function_on_click',
        textToRender: 'Ver',
        onClickFunction: this.reprintCashAdvance
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.cashAdvances
    const list = <AdminTable headerOrder={headerOrder} model='cashAdvances' data={tableData}
      idField='id' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/cashadvances/' successType='FETCH_CASH_ADVANCES_FULFILLED' errorType='FETCH_CASH_ADVANCES_REJECTED' />
        <Pagination url='/api/cashadvances/' successType='FETCH_CASH_ADVANCES_FULFILLED' errorType='FETCH_CASH_ADVANCES_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Adelantos de Efectivo:</h1>
      </div>
      <SearchAdmin model='cashadvance' namespace='adminSearch' />
      {paginationDiv}
      {/* <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/cashAdvances/' successType='FETCH_CASH_ADVANCES_FULFILLED' errorType='FETCH_CASH_ADVANCES_REJECTED' />
        <Pagination url='/api/cashAdvances/' successType='FETCH_CASH_ADVANCES_FULFILLED' errorType='FETCH_CASH_ADVANCES_REJECTED' />
      </div> */}
      {content}
    </div>

  }

}
