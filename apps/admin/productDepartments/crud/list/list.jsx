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
    productDepartments: store.productDepartments.productDepartments,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults,
    paginatedSearchResults: store.adminSearch.paginatedSearchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PRODUCT_DEPARTMENT', payload: ''})

    const productDepartmentKwargs = {
      url: `/api/productdepartments/?limit=${this.props.pageSize}`,
      successType: 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_DEPARTMENTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(productDepartmentKwargs))

  }

  render() {

    const headerOrder = [
      {
        field: 'consecutive',
        text: 'Código',
        type: 'primary'
      }, {
        field: 'name',
        text: 'Nombre'
      }, {
        field: 'identifier',
        text: 'Identificador'
      }
    ]
    const fetching = <div />
    const tableData = this.props.paginated
      ? this.props.paginatedSearchResults.length ? this.props.paginatedSearchResults : this.props.productDepartments
      : this.props.searchResults.length ? this.props.searchResults : this.props.productDepartments

    const list = <AdminTable headerOrder={headerOrder} model='department' data={tableData}
      addLink='/admin/productdepartments/add' idField='id' sortedBy='identifier' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/productdepartments/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    const paginationDiv = this.props.paginated
      ? !this.props.paginatedSearchResults.length
        ? <div className='admin-list-results-pagination' >
          <ResultsPerPage url='/api/productdepartments/' successType='FETCH_PRODUCT_DEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_DEPARTMENTS_REJECTED' />
          <Pagination url='/api/productdepartments/' successType='FETCH_PRODUCT_DEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_DEPARTMENTS_REJECTED' />
        </div>
        : <PaginatedSearchNavigation namespace='adminSearch' />
      : !this.props.searchResults.length
        ? <div className='admin-list-results-pagination' >
          <ResultsPerPage url='/api/productdepartments/' successType='FETCH_PRODUCT_DEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_DEPARTMENTS_REJECTED' />
          <Pagination url='/api/productdepartments/' successType='FETCH_PRODUCT_DEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_DEPARTMENTS_REJECTED' />
        </div>
        : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Familias:</h1>
        {addLink}
      </div>

      <SearchAdmin paginated={this.props.paginated} model='department' namespace='adminSearch' />
      {paginationDiv}

      {content}
    </div>
    /*const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='productDepartments' data={this.props.productDepartments}
      addLink='/admin/productdepartments/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/productdepartments/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Familias de Producto:</h1>
        {addLink}
      </div>
      <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div>
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/productdepartments/' successType='FETCH_PRODUCT_DEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_DEPARTMENTS_REJECTED' />
        <Pagination url='/api/productdepartments/' successType='FETCH_PRODUCT_DEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_DEPARTMENTS_REJECTED' />
      </div>
      {content}
    </div>*/

  }

}
