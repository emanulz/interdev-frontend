/*
 * Module dependencies
 */
import React from 'react'
import routes from './routes.js'
import { checkUserPermissions } from '../../../utils/checkPermissions'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    permissions: store.sales.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'sales.add_sale',
      change: 'sales.change_sale',
      list: 'sales.list_sale',
      delete: 'sales.delete_sale'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_SALE_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_SALE_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // ******************************************************************
  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
