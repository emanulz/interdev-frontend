/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import DataTable from '../../../../../general/dataTable/dataTable.jsx'
import { getItemDispatch } from '../../../../../utils/api'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    users: store.users.users
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_USER', payload: ''})

    const userKwargs = {
      url: '/api/users',
      successType: 'FETCH_USERS_FULFILLED',
      errorType: 'FETCH_USERS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(userKwargs))

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
    const list = <DataTable headerOrder={headerOrder} model='users' data={this.props.users}
      addLink='/admin/users/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <h1>Listado de Clientes:</h1>
      {content}
    </div>

  }

}
