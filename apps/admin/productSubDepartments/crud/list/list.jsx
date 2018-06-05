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
    productSubDepartments: store.productSubDepartments.productSubDepartments,
    pageSize: store.pagination.pageSize
  }
})
export default class List extends React.Component {

  componentWillMount() {

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
        field: 'code',
        text: 'Código',
        type: 'primary'
      }, {
        field: 'name',
        text: 'Nombre'
      }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='productsubdepartments' data={this.props.productSubDepartments}
      addLink='/admin/productsubdepartments/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/productdepartments/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Sub-Familias de Producto:</h1>
        {addLink}
      </div>
      <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div>
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/productsubdepartments/' successType='FETCH_PRODUCT_DEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_DEPARTMENTS_REJECTED' />
        <Pagination url='/api/productsubdepartments/' successType='FETCH_PRODUCT_DEPARTMENTS_FULFILLED' errorType='FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED' />
      </div>
      {content}
    </div>

  }

}
