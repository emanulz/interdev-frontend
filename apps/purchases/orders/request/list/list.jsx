/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    requests: store.requests.requests,
    pageSize: store.pagination.pageSize
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_REQUEST', payload: ''})

    const projectKwargs = {
      url: `/api/requests/?limit=${this.props.pageSize}`,
      successType: 'FETCH_REQUESTS_FULFILLED',
      errorType: 'FETCH_REQUESTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(projectKwargs))

  }

  render() {

    const headerOrder = [
      {
        field: 'id',
        text: 'Código',
        type: 'primary'
      }, {
        field: 'name',
        text: 'Nombre'
      }, {
        field: 'description',
        text: 'Descripción'
      }, {
        field: 'is_active',
        text: 'Activo?',
        type: 'bool'
      }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='requests' data={this.props.requests}
      addLink='/admin/requests/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/purchases/requests/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Pedidos:</h1>
        {addLink}
      </div>
      <SearchAdmin model='request' namespace='requestSearch' />

      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/requests/' successType='FETCH_REQUESTS_FULFILLED' errorType='FETCH_REQUESTS_REJECTED' />
        <Pagination url='/api/requests/' successType='FETCH_REQUESTS_FULFILLED' errorType='FETCH_REQUESTS_REJECTED' />
      </div>
      {content}
    </div>

  }

}
