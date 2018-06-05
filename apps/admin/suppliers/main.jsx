/*
 * Module dependencies
 */
import React from 'react'
import routes from './routes.js'
import { checkUserPermissions } from '../../../utils/checkPermissions'
// import { getItemDispatch } from '../../../utils/api.js'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    permissions: store.suppliers.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'suppliers.add_supplier',
      change: 'suppliers.change_supplier',
      list: 'suppliers.list.supplier',
      delete: 'suppliers.delete_supplier'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_SUPPLIER_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_SUPPLIER_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    // const supplierKwargs = {
    //   url: '/api/suppliers',
    //   successType: 'FETCH_SUPPLIERS_FULFILLED',
    //   errorType: 'FETCH_SUPPLIERS_REJECTED'
    // }
    // this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    // this.props.dispatch(getItemDispatch(supplierKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
