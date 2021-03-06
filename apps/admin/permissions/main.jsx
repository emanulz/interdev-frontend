/*
 * Module dependencies
 */
import React from 'react'
import { checkUserPermissions } from '../../../utils/checkPermissions'
import { getItemDispatch } from '../../../utils/api.js'
import Unauthorized from '../../../general/unauthorized.jsx'
import ContainerComponent from './components/container.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    permissions: store.users.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'auth.add_user',
      change: 'auth.change_user',
      list: 'auth.list_user',
      delete: 'auth.delete_user'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_USER_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_USER_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const userKwargs = {
      url: '/api/users',
      successType: 'FETCH_USERS_FULFILLED',
      errorType: 'FETCH_USERS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(userKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    let content = ''

    switch (this.props.permissions.change) {
      case true:
      {
        content = <ContainerComponent />
        break
      } // case

      case false:
      {
        content = <Unauthorized />
        break
      } // case
      default:
      {
        content = <div />
        break
      } // case
    }

    return <div className='Main heigh100 permissions'>
      {content}
    </div>

  }

}
