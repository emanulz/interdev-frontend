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

@connect((store) => {
  return {
    sales: store.sale.sales,
    pageSize: store.pagination.pageSize,
    searchResults: store.saleSearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'SALES_PANEL_MOUNTED', payload: ''})
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_SALE', payload: ''})
    this.props.dispatch({type: 'CLEAR_SALES', payload: ''})

    const saleKwargs = {
      url: `/api/saleslist/?limit=${this.props.pageSize}&ordering=-consecutive`,
      successType: 'FETCH_SALES_FULFILLED',
      errorType: 'FETCH_SALES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(saleKwargs))

  }

  // Render the sale
  render() {
    const getClientNameClosure = (item) => {
      function getName(item) {
        if (item == undefined || item.client =='') {
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
    const sales = this.props.sales

    const headerOrder = [
      {
        field: 'consecutive',
        text: 'Consecutivo',
        type: 'primaryNoEdit'
      }, {
        field: 'created',
        text: 'Fecha',
        type: 'date'
      }, {
        type: 'function_process',
        field: 'client',
        text: 'Cliente',
        worker_method: getClientNameClosure
      }, {
        field: 'sale_total',
        text: 'Monto',
        type: 'price'
      }, {
        field: 'consecutive',
        text: 'Devolución',
        textToRender: 'Devolución',
        type: 'textLink'
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : sales
    const list = <AdminTable headerOrder={headerOrder} model='moneyreturn' data={tableData}
      idField='id' app='returns' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/saleslist/' successType='FETCH_SALES_FULFILLED' errorType='FETCH_SALES_REJECTED' />
        <Pagination url='/api/saleslist/' successType='FETCH_SALES_FULFILLED' errorType='FETCH_SALES_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Ventas:</h1>
      </div>
      <SearchAdmin model='sale' namespace='saleSearch' />

      {paginationDiv}
      {content}
    </div>

  }
}
