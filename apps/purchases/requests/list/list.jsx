/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../utils/api.js'
import Pagination from '../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../general/pagination/resultsPerPage.jsx'
import {loadRequestToPrint} from '../../../../general/printRequest/actions.js'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    requests: store.request.requests,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_REQUEST', payload: ''})
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const requestKwargs = {
      url: `/api/requests/?limit=${this.props.pageSize}&ordering=-consecutive`,
      successType: 'FETCH_REQUESTS_FULFILLED',
      errorType: 'FETCH_REQUESTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(requestKwargs))
  }

  reprintRequest(item) {
    this.props.dispatch(loadRequestToPrint(item))
  }

  render() {

    const getSupplierNameClosure = (item) => {
      function getName(item) {
        if (item == undefined || item == '') {
          return 'SIN NOMBRE'
        }
        try {
          const supplier = JSON.parse(item)
          return `${supplier.name}`
        } catch (err) { console.log(err) }
        return 'ERROR EN NOMBRE'
      }
      return getName(item)
    }

    const getProjectNameClosure = (item) => {
      function getName(item) {
        if (item == undefined || item == '') {
          return 'SIN NOMBRE'
        }
        try {
          const project = JSON.parse(item)
          return `${project.name}`
        } catch (err) { console.log(err) }
        return 'ERROR EN NOMBRE'
      }
      return getName(item)
    }

    const getActivityNameClosure = (item) => {
      function getName(item) {
        if (item == undefined || item == '') {
          return 'SIN NOMBRE'
        }
        try {
          const activity = JSON.parse(item)
          return `${activity.name}`
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
        field: 'created',
        text: 'Fecha',
        type: 'date'
      }, {
        type: 'function_process',
        field: 'supplier',
        text: 'Proveedor',
        worker_method: getSupplierNameClosure
      }, {
        type: 'function_process',
        field: 'project',
        text: 'Proyecto',
        worker_method: getProjectNameClosure
      }, {
        type: 'function_process',
        field: 'activity',
        text: 'Actividad',
        worker_method: getActivityNameClosure
      }, {
        field: 'consecutive',
        text: 'Reimprimir',
        type: 'function_on_click',
        textToRender: 'Ver',
        onClickFunction: this.reprintRequest
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.requests
    const list = <AdminTable headerOrder={headerOrder} model='requests' data={tableData}
      idField='id' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/requests/?ordering=-consecutive' successType='FETCH_REQUESTS_FULFILLED' errorType='FETCH_REQUESTS_REJECTED' />
        <Pagination url='/api/requests/?ordering=-consecutive' successType='FETCH_REQUESTS_FULFILLED' errorType='FETCH_REQUESTS_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Ordenes de Cotización:</h1>
      </div>
      {/* <SearchAdmin model='request' namespace='adminSearch' /> */}
      <SearchAdmin model='request' namespace='adminSearch' />
      {paginationDiv}
      {content}
    </div>

  }

}
