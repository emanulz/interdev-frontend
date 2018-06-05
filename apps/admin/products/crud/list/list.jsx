/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    products: store.products.products,
    pageSize: store.pagination.pageSize
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PRODUCT', payload: ''})

    const productKwargs = {
      url: `/api/products/?limit=${this.props.pageSize}`,
      successType: 'FETCH_PRODUCTS_FULFILLED',
      errorType: 'FETCH_PRODUCTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(productKwargs))

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
      }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='products' data={this.props.products}
      addLink='/admin/products/add' idField='id' sortedBy='code' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/products/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Productos:</h1>
        {addLink}
      </div>
      <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div>
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/products/' successType='FETCH_PRODUCTS_FULFILLED' errorType='FETCH_PRODUCTS_REJECTED' />
        <Pagination url='/api/products/' successType='FETCH_PRODUCTS_FULFILLED' errorType='FETCH_PRODUCTS_REJECTED' />
      </div>
      {content}
    </div>

  }

}
