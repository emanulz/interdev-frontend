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
    users: store.users.users,
    pageSize: store.pagination.pageSize
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_USER', payload: ''})

    const userKwargs = {
      url: `/api/users/?limit=${this.props.pageSize}`,
      successType: 'FETCH_USERS_FULFILLED',
      errorType: 'FETCH_USERS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(userKwargs))

  }

  render() {

    const headerOrder = [
      {
        field: 'username',
        text: 'Usuario',
        type: 'primary'
      }, {
        field: 'first_name',
        text: 'Nombre'
      }, {
        field: 'last_name',
        text: 'Apellido'
      }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='users' data={this.props.users}
      addLink='/admin/users/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/clients/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Usuarios:</h1>
        {addLink}
      </div>
      <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div>
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/users/' successType='FETCH_USERS_FULFILLED' errorType='FETCH_USERS_REJECTED' />
        <Pagination url='/api/users/' successType='FETCH_USERS_FULFILLED' errorType='FETCH_USERS_REJECTED' />
      </div>
      {content}
    </div>

  }

}
