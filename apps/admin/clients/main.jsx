/*
 * Module dependencies
 */
import React from 'react'
import routes from './routes.js'
import { checkUserPermissions } from '../../../utils/checkPermissions'
import { getItemDispatch } from '../../../utils/api.js'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    permissions: store.clients.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'clients.add_client',
      change: 'clients.change_client',
      list: 'clients.list_client',
      delete: 'clients.delete_client'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_CLIENT_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_CLIENT_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const clientKwargs = {
      url: '/api/clients',
      successType: 'FETCH_CLIENTS_FULFILLED',
      errorType: 'FETCH_CLIENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(clientKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
