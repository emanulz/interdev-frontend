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
      url: '/api/clients',
      successType: 'FETCH_CLIENTS_FULFILLED',
      errorType: 'FETCH_CLIENTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(clientKwargs))

  }

  // Render the product
  render() {
    const clients = this.props.clients

    const dataFiltered = clients.filter(el => el.balance > 0 || el.has_credit)

    const headerOrder = [
      {
        field: 'code',
        text: 'Código',
        type: 'primaryNoEdit'
      }, {
        field: 'name',
        text: 'Nombre',
        type: 'text'
      }, {
        field: 'last_name',
        text: 'Apellido',
        type: 'text'
      },
      {
        field: 'debt',
        text: 'Saldo',
        type: 'price'
      },
      {
        field: 'code',
        text: 'Facturas Pendientes',
        textToRender: 'Ver Pendientes',
        type: 'textLink'
      }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='receivable' data={dataFiltered}
      idField='id' app='credits' />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Cuentas por cobrar:</h1>
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
