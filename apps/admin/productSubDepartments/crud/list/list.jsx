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
    productSubDepartments: store.productSubDepartments.productSubDepartments,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults,
    paginatedSearchResults: store.adminSearch.paginatedSearchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PRODUCT_SUBDEPARTMENT', payload: ''})

    const productSubDepartmentKwargs = {
      url: `/api/productsubdepartments/?limit=${this.props.pageSize}`,
      successType: 'FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(productSubDepartmentKwargs))

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
      ? this.props.paginatedSearchResults.length ? this.props.paginatedSearchResults : this.props.productSubDepartments
      : this.props.searchResults.length ? this.props.searchResults : this.props.productSubDepartments

    const list = <AdminTable headerOrder={headerOrder} model='department' data={tableData}
      addLink='/admin/productsubdepartments/add' idField='id' sortedBy='identifier' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/productsubdepartments/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    const paginationDiv = this.props.paginated
      ? !this.props.paginatedSearchResults.length
        ? <div className='admin-list-results-pagination' >
          <ResultsPerPage url='/api/productsubdepartments/' successType='FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED' />
          <Pagination url='/api/productsubdepartments/' successType='FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED' />
        </div>
        : <PaginatedSearchNavigation namespace='adminSearch' />
      : !this.props.searchResults.length
        ? <div className='admin-list-results-pagination' >
          <ResultsPerPage url='/api/productsubdepartments/' successType='FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED' />
          <Pagination url='/api/productsubdepartments/' successType='FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED' />
        </div>
        : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Sub Familias:</h1>
        {addLink}
      </div>

      <SearchAdmin paginated={this.props.paginated} model='subdepartment' namespace='adminSearch' />
      {paginationDiv}

      {content}
    </div>
    // const fetching = <div />
    // const list = <AdminTable headerOrder={headerOrder} model='productsubdepartments' data={this.props.productSubDepartments}
    //   addLink='/admin/productsubdepartments/add' idField='id' />

    // const content = this.props.fetching ? fetching : list

    // const addLink = <Link className='addBtn' to={'/admin/productsubdepartments/add'}>
    //   <span className='fa fa-plus' />
    //   Agregar
    // </Link>

    // return <div className='list list-container'>
    //   <div className='admin-list-header'>
    //     <h1>Mantenimiento de Sub-Familias de Producto:</h1>
    //     {addLink}
    //   </div>
    //   <div className='admin-list-search'>
    //     <input
    //       type='text'
    //       placeholder='Ingrese un texto para buscar...'
    //     />
    //   </div>
    //   <div className='admin-list-results-pagination' >
    //     <ResultsPerPage url='/api/productsubdepartments/' successType='FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED' />
    //     <Pagination url='/api/productsubdepartments/' successType='FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_SUBSUBDEPARTMENTS_REJECTED' />
    //   </div>
    //   {content}
    // </div>

  }

}
