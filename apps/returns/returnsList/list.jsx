/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

// components
import AdminTable from '../../../general/adminTable/adminTable.jsx'
import { getPaginationItemDispatch } from '../../../utils/api.js'
import Pagination from '../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../general/pagination/resultsPerPage.jsx'
import SearchAdmin from '../../../general/search/searchAdmin.jsx'
import {loadReturnToPrint} from '../../../general/printReturn/actions.js'

@connect((store) => {
  return {
    returns: store.returnCart.returns,
    pageSize: store.pagination.pageSize,
    searchResults: store.returnSearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'RETURNS_LIST_PANEL_MOUNTED', payload: ''})
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_RETURNS', payload: ''})

    const saleKwargs = {
      url: `/api/returns/?limit=${this.props.pageSize}&ordering=-consecutive`,
      successType: 'FETCH_RETURNS_FULFILLED',
      errorType: 'FETCH_RETURNS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(saleKwargs))

  }

  reprintReturn(item) {
    this.props.dispatch(loadReturnToPrint(item))
  }

  // Render the sale
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
    const returns = this.props.returns

    const headerOrder = [
      {
        field: 'consecutive',
        text: 'Consecutivo',
        type: 'text'
      }, {
        field: 'created',
        text: 'Fecha',
        type: 'date'
      }, {
        type: 'function_process',
        field: 'client',
        text: 'Cliente Hacienda',
        worker_method: getClientNameClosure
      }, {
        type: 'CLIENT_NAME_EXTRAS',
        field: 'client',
        text: 'Nombre en Factura'
      }, {
        field: 'amount',
        text: 'Monto',
        type: 'price'
      }, {
        field: 'consecutive',
        text: 'Devolución',
        type: 'function_on_click',
        textToRender: 'Ver',
        onClickFunction: this.reprintReturn
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : returns
    const list = <AdminTable headerOrder={headerOrder} model='moneyreturn' data={tableData}
      idField='id' app='returns' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/returns/' successType='FETCH_RETURNS_FULFILLED' errorType='FETCH_RETURNS_REJECTED' />
        <Pagination url='/api/returns/' successType='FETCH_RETURNS_FULFILLED' errorType='FETCH_RETURNS_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Devoluciones:</h1>
      </div>
      <SearchAdmin model='return' namespace='returnSearch' />

      {paginationDiv}
      {content}
    </div>

  }
}
