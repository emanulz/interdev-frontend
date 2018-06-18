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
    senders: store.senders.senders,
    pageSize: store.pagination.pageSize
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_SENDER', payload: ''})

    const senderKwargs = {
      url: `/api/senders/?limit=${this.props.pageSize}`,
      successType: 'FETCH_SENDERS_FULFILLED',
      errorType: 'FETCH_SENDERS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(senderKwargs))

  }

  render() {

    const headerOrder = [
      {
        field: 'id_number',
        text: 'Identificación',
        type: 'primary'
      }, {
        field: 'name',
        text: 'Nombre'
      }, {
        field: 'commercial_name',
        text: 'Nombre comercial'
      }, {
        field: 'email',
        text: 'Email'
      }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='senders' data={this.props.senders}
      addLink='/admin/senders/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/senders/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Emisores de Factura:</h1>
        {addLink}
      </div>
      <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div>
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/senders/' successType='FETCH_SENDERS_FULFILLED' errorType='FETCH_SENDERS_REJECTED' />
        <Pagination url='/api/senders/' successType='FETCH_SENDERS_FULFILLED' errorType='FETCH_SENDERS_REJECTED' />
      </div>
      {content}
    </div>

  }

}
