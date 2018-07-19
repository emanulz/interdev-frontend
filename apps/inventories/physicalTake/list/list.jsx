/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'
import Pagination from '../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../general/pagination/resultsPerPage.jsx'
import { getPaginationItemDispatch } from '../../../../utils/api.js'

@connect((store) => {
  return {
    fullWidth: store.physicalTake.fullWidth,
    physicalTakes: store.physicalTake.physicalTakes,
    pageSize: store.pagination.pageSize,
    searchResults: store.inventorySearch.searchResults
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PHYSICAL_TAKES', payload: ''})
    this.props.dispatch({type: `inventorySearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const takeKwargs = {
      url: `/api/physicaltakes/?limit=${this.props.pageSize}&ordering=-consecutive`,
      successType: 'FETCH_PHYSICAL_TAKES_FULFILLED',
      errorType: 'FETCH_PHYSICAL_TAKES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(takeKwargs))
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'physicalTake-list fullWidth' : 'physicalTake-list'

    const setTypeOfTake = (item) => {
      if (item) {
        return 'Toma Completa'
      }
      return 'Toma Parcial'
    }

    const headerOrder = [
      {
        field: 'consecutive',
        text: 'Consecuivo',
        type: 'text'
      }, {
        field: 'warehouse_name',
        text: 'Bodega'
      }, {
        field: 'description',
        text: 'Descripción'
      }, {
        type: 'function_process',
        field: 'is_full',
        text: 'Tipo',
        worker_method: setTypeOfTake
      }, {
        field: 'is_closed',
        text: 'Cerrada?',
        type: 'bool'
      }
    ]

    return <div className={contentClass}>
      <div className='physicalTake-create-header'>
        Listado de tomas Físicas
      </div>
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/physicaltakes/' successType='FETCH_PHYSICAL_TAKES_FULFILLED' errorType='FETCH_PHYSICAL_TAKES_REJECTED' />
        <Pagination url='/api/physicaltakes/' successType='FETCH_PHYSICAL_TAKES_FULFILLED' errorType='FETCH_PHYSICAL_TAKES_REJECTED' />
      </div>
      <AdminTable headerOrder={headerOrder} model='clients' data={this.props.physicalTakes}
        idField='id' />
    </div>

  }

}
