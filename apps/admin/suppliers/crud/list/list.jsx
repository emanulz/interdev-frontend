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
    suppliers: store.suppliers.suppliers
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_SUPPLIER', payload: ''})

    const supplierKwargs = {
      url: '/api/suppliers',
      successType: 'FETCH_SUPPLIERS_FULFILLED',
      errorType: 'FETCH_SUPPLIERS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(supplierKwargs))

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
        field: 'id_num',
        text: 'Identificación'
      }, {
        field: 'phone_number',
        text: 'Teléfono'
      }, {
        field: 'email',
        text: 'Email'
      }, {
        field: 'address',
        text: 'Dirección'
      }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='suppliers' data={this.props.suppliers}
      addLink='/admin/suppliers/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/suppliers/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Proveedores:</h1>
        {addLink}
      </div>
      <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div>
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/suppliers/' successType='FETCH_SUPPLIERS_FULFILLED' errorType='FETCH_SUPPLIERS_REJECTED' />
        <Pagination url='/api/suppliers/' successType='FETCH_SUPPLIERS_FULFILLED' errorType='FETCH_SUPPLIERS_REJECTED' />
      </div>
      {content}
    </div>

  }

}
