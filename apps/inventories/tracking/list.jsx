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
    products: store.products.products,
    pageSize: store.pagination.pageSize,
    searchResults: store.inventorySearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'TRACKING_PANEL_MOUNTED', payload: ''})
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PRODUCT', payload: ''})

    const productKwargs = {
      url: `/api/productslist/?limit=${this.props.pageSize}`,
      successType: 'FETCH_PRODUCTS_FULFILLED',
      errorType: 'FETCH_PRODUCTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(productKwargs))

  }

  // Render the product
  render() {
    const products = this.props.products

    const dataFiltered = products.filter(el => el.inventory_enabled)

    const headerOrder = [
      {
        field: 'code',
        text: 'Código',
        type: 'primaryNoEdit'
      }, {
        field: 'description',
        text: 'Descripción',
        type: 'text',
        width: '50%'
      }, {
        field: 'inventory',
        text: 'Existencia Total',
        type: 'text'
      },
      {
        field: 'code',
        text: 'Histórico',
        textToRender: 'Ver Histórico',
        type: 'textLink'
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : dataFiltered
    const list = <AdminTable headerOrder={headerOrder} model='tracking' data={tableData}
      idField='id' app='inventories' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/productslist/' successType='FETCH_PRODUCTS_FULFILLED' errorType='FETCH_PRODUCTS_REJECTED' />
        <Pagination url='/api/productslist/' successType='FETCH_PRODUCTS_FULFILLED' errorType='FETCH_PRODUCTS_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Productos e Histórico:</h1>
      </div>
      <SearchAdmin model='product' namespace='inventorySearch' />
      {/* <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div> */}
      {paginationDiv}
      {content}
    </div>

  }
}
