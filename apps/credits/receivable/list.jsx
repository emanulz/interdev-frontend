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

    const dropdownElements = [
      {
        url: '/credits/receivable',
        text: 'Facturas Pendientes de Pago',
        iconClass: 'fa fa-list'
      },
      {
        url: '/credits/payment',
        text: 'Pago a Facturas',
        iconClass: 'fa fa-list'
      },
      {
        url: '/credits/receivable/payments/list',
        text: 'Listado de Pagos',
        iconClass: 'fa fa-list'
      }
    ]

    if (this.props.conf.canAddManualCreditMovements) {
      dropdownElements.push(
        {
          text: 'Movimiento Manual',
          url: '/credits/receivable/payments/addmovement',
          iconClass: 'fa fa-list'
        }
      )
    }

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
      // {
      //   field: 'code',
      //   text: 'Pago',
      //   textToRender: 'Pago a Facturas',
      //   target: 'payment',
      //   type: 'link_mask',
      //   uniqueId: 1
      // },
      {
        field: 'code',
        text: 'Acciones Disponibles',
        textToRender: 'Acciones',
        type: 'dropdown',
        elements: dropdownElements
      }
    ]

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
