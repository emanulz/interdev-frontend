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
      add: 'sales.add_credit_voucher',
      change: 'sales.change_credit_voucher',
      list: 'sales.list_credit_voucher',
      delete: 'sales.delete_credit_voucher'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_CREDIT_VOUCHERS_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_CREDIT_VOUCHERS_PERMISSIONS_REJECTED'
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
