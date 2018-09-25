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
    clientCategories: store.clientCategories.clientCategories,
    pageSize: store.pagination.pageSize
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT_CATEGORY', payload: ''})

    const clientCategoryKwargs = {
      url: `/api/clientcategories/?limit=${this.props.pageSize}`,
      successType: 'FETCH_CLIENT_CATEGORIES_FULFILLED',
      errorType: 'FETCH_CLIENT_CATEGORIES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(clientCategoryKwargs))

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
      }, {
        field: 'pred_discount',
        text: 'Descuento Predeterminado %'
      }, {
        field: 'max_discount',
        text: 'Descuento Máximo %'
      }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='clientCategories' data={this.props.clientCategories}
      addLink='/admin/clientcategories/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/clientcategories/add'}>
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
        <ResultsPerPage url='/api/clientcategories/' successType='FETCH_CLIENT_CATEGORIES_FULFILLED' errorType='FETCH_CLIENT_CATEGORIES_REJECTED' />
        <Pagination url='/api/clientcategories/' successType='FETCH_CLIENT_CATEGORIES_FULFILLED' errorType='FETCH_CLIENT_CATEGORIES_REJECTED' />
      </div>
      {content}
    </div>

  }

}
