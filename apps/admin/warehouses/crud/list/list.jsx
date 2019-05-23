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
    warehouses: store.warehouses.warehouses,
    pageSize: store.pagination.pageSize
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_WAREHOUSE', payload: ''})

    const warehouseKwargs = {
      url: `/api/warehouses/?limit=${this.props.pageSize}`,
      successType: 'FETCH_WAREHOUSES_FULFILLED',
      errorType: 'FETCH_WAREHOUSES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(warehouseKwargs))

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
        field: 'description',
        text: 'Descripción'
      },
      {
        field: 'id',
        text: 'Existencias',
        textToRender: 'Existencias',
        baseLink: '/reportsExcel/warehouseinv',
        type: 'link_params',
        fieldAsParams: [{field: 'id', name:'warehouseinvid'}],
        extraParams: []
    }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='warehouses' data={this.props.warehouses}
      addLink='/admin/warehouses/add' idField='id' />

    const content = this.props.fetching ? fetching : list
    const addLink = <Link className='addBtn' to={'/admin/warehouses/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Bodegas:</h1>
        {addLink}
      </div>
      {/* <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div> */}
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/warehouses/' successType='FETCH_WAREHOUSES_FULFILLED' errorType='FETCH_WAREHOUSES_REJECTED' />
        <Pagination url='/api/warehouses/' successType='FETCH_WAREHOUSES_FULFILLED' errorType='FETCH_WAREHOUSES_REJECTED' />
      </div>
      {content}
    </div>

  }

}
