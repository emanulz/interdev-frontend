/*
 * Module dependencies
 */
import React from 'react'
import routes from './routes.js'
import { checkUserPermissions } from '../../../utils/checkPermissions'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    permissions: store.cashAdvances.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'sales.add_cash_advance',
      change: 'sales.change_cash_advance',
      list: 'sales.list_cash_advance',
      delete: 'sales.delete_cash_advance'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_CASH_ADVANCES_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_CASH_ADVANCES_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************
  }

  // Main Layout
  render() {
    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
