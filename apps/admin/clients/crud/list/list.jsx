/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import {Link} from 'react-router-dom'
import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    clients: store.clients.clients,
    pageSize: store.pagination.pageSize
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})

    const clientKwargs = {
      url: `/api/clients/?limit=${this.props.pageSize}`,
      successType: 'FETCH_CLIENTS_FULFILLED',
      errorType: 'FETCH_CLIENTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(clientKwargs))
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
        field: 'last_name',
        text: 'Apellido'
      }, {
        field: 'id_num',
        text: 'Identificación'
      }, {
        field: 'has_credit',
        text: 'Tiene Crédito',
        type: 'bool'
      }, {
        field: 'credit_limit',
        text: 'Límite de crédito',
        type: 'price'
      }, {
        field: 'credit_days',
        text: 'Días de crédito'
      }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='clients' data={this.props.clients}
      idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/clients/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Clientes:</h1>
        {addLink}
      </div>
      <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div>
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/clients/' successType='FETCH_CLIENTS_FULFILLED' errorType='FETCH_CLIENTS_REJECTED' />
        <Pagination url='/api/clients/' successType='FETCH_CLIENTS_FULFILLED' errorType='FETCH_CLIENTS_REJECTED' />
      </div>
      {content}
    </div>

  }

}
