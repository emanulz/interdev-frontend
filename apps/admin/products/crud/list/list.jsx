/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    products: store.products.products,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PRODUCT', payload: ''})
    this.props.dispatch({type: 'CLEAR_IMAGE_FILE', payload: ''})
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const productKwargs = {
      url: `/api/productslist/?limit=${this.props.pageSize}`,
      successType: 'FETCH_PRODUCTS_FULFILLED',
      errorType: 'FETCH_PRODUCTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(productKwargs))

  }

  componentWillUnMount() {
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})
  }

  render() {

    const headerOrder = [
      {
        field: 'code',
        text: 'Código',
        type: 'primary',
        width: '150px'
      }, {
        field: 'description',
        text: 'Descripción'
      }, {
        field: 'use_taxes',
        text: 'Usa Impuesto',
        type: 'bool'
      }, {
        field: 'taxes',
        text: 'Impuesto'
      }, {
        field: 'sell_price1',
        text: 'Precio de Venta',
        type: 'price'
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.products
    const list = <AdminTable headerOrder={headerOrder} model='products' data={tableData}
      addLink='/admin/products/add' idField='id' sortedBy='code' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/products/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/productslist/' successType='FETCH_PRODUCTS_FULFILLED' errorType='FETCH_PRODUCTS_REJECTED' />
        <Pagination url='/api/productslist/' successType='FETCH_PRODUCTS_FULFILLED' errorType='FETCH_PRODUCTS_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Productos:</h1>
        {addLink}
      </div>

      <SearchAdmin model='product' namespace='adminSearch' />
      {paginationDiv}
      {/* <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/productslist/' successType='FETCH_PRODUCTS_FULFILLED' errorType='FETCH_PRODUCTS_REJECTED' />
        <Pagination url='/api/productslist/' successType='FETCH_PRODUCTS_FULFILLED' errorType='FETCH_PRODUCTS_REJECTED' />
      </div> */}
      {content}
    </div>

  }

}
