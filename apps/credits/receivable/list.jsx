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
    fething: store.fetching.fetching,
    clients: store.clients.clients,
    pageSize: store.pagination.pageSize,
    searchResults: store.receivableSearch.searchResults,
    conf: store.config.globalConf
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})

    const clientKwargs = {
      url: `/api/clients/?has_credit=True&limit=${this.props.pageSize}`,
      successType: 'FETCH_CLIENTS_FULFILLED',
      errorType: 'FETCH_CLIENTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(clientKwargs))

  }

  // Render the product
  render() {

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
        field: 'balance',
        text: 'Saldo',
        type: 'priceAbs'
      },
      {
        field: 'code',
        text: 'Facturas Pendientes',
        textToRender: 'Ver Pendientes',
        type: 'textLink'
      },
      {
        field: 'code',
        text: 'Pago',
        textToRender: 'Pago a Facturas',
        target: 'payment',
        type: 'link_mask',
        uniqueId: 1
      },
      {
        field: 'code',
        text: 'Listado de Pagos',
        textToRender: 'Listado de Pagos',
        target: 'receivable/payments/list',
        type: 'link_mask',
        uniqueId: 2
      }
    ]

    if (this.props.conf.canAddManualCreditMovements) {
      headerOrder.push(
        {
          field: 'code',
          text: 'Mov Manual',
          textToRender: 'Movimiento',
          target: 'receivable/payments/addmovement',
          type: 'link_mask',
          uniqueId: 3
        }
      )
    }

    const fetching = <div />

    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.clients

    // const dataFiltered = tableData.filter(el => el.balance > 0 || el.has_credit)

    const list = <AdminTable headerOrder={headerOrder} model='receivable' data={tableData}
      idField='id' app='credits' />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Cuentas por cobrar:</h1>
      </div>
      {/* <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div> */}
      <SearchAdmin model='client' namespace='receivableSearch' />
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/clients/?has_credit=True' successType='FETCH_CLIENTS_FULFILLED' errorType='FETCH_CLIENTS_REJECTED' />
        <Pagination url='/api/clients/?has_credit=True' successType='FETCH_CLIENTS_FULFILLED' errorType='FETCH_CLIENTS_REJECTED' />
      </div>
      {content}
    </div>

  }
}
