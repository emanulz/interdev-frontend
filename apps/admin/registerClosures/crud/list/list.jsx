/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    closures: store.registerclosures.registerClosures,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_REGISTER_CLOSURES', payload: ''})
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const presaleKwargs = {
      url: `/api/registerclosure/?limit=${this.props.pageSize}&ordering=-id`,
      successType: 'FETCH_REGISTER_CLOSURES_FULFILLED',
      errorType: 'FETCH_REGISTER_CLOSURES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(presaleKwargs))
  }

  render() {

    const headerOrder = [
      {
        field: 'id',
        text: 'Consecutivo',
        type: 'primaryNoEdit'
      }, {
        field: 'cashier_name',
        text: 'Cajero'
      }, {
        field: 'opening_money_crc',
        text: 'Apertura Colones',
        type: 'price'
      }, {
        field: 'is_open',
        text: 'Abierta?',
        type: 'bool'
      }, {
        field: 'closure_money_crc_system_cash',
        text: 'Cierre Sistema Efectivo Colones',
        type: 'price'
      }, {
        field: 'closure_money_crc_cashier',
        text: 'Cierre Cajero Efectivo Colones',
        type: 'price'
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.closures
    const list = <AdminTable headerOrder={headerOrder} model='registerclosures' data={tableData}
      idField='id' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/registerclosure/' successType='FETCH_REGISTER_CLOSURES_FULFILLED' errorType='FETCH_REGISTER_CLOSURES_REJECTED' />
        <Pagination url='/api/registerclosure/' successType='FETCH_REGISTER_CLOSURES_FULFILLED' errorType='FETCH_REGISTER_CLOSURES_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Cierres de Caja:</h1>
      </div>
      {/* <SearchAdmin model='presale' namespace='adminSearch' /> */}
      {paginationDiv}
      {content}
    </div>

  }

}
