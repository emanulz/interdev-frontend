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
    permissions: store.warehouses.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'WAREHOUSES_PANEL_MOUNTED', payload: ''})

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'warehouses.add_warehouse',
      change: 'warehouses.change_warehouse',
      list: 'warehouses.list_warehouse',
      delete: 'warehouses.delete_warehouse'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_WAREHOUSE_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_WAREHOUSE_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const warehouseKwargs = {
      url: '/api/warehouses',
      successType: 'FETCH_WAREHOUSES_FULFILLED',
      errorType: 'FETCH_WAREHOUSES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(warehouseKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
