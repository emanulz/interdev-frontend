/*
 * Module dependencies
 */
import React from 'react'
import routes from './routes.js'
import { checkUserPermissions } from '../../utils/checkPermissions'
import { getItemDispatch } from '../../utils/api.js'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    permissions: store.productSubDepartments.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'products.add_productsubdepartment',
      change: 'products.change_productsubdepartment',
      list: 'products.list_productsubdepartment',
      delete: 'products.delete_productsubdepartment'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_PRODUCT_SUBDEPARTMENT_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_PRODUCT_SUBDEPARTMENT_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const productSubDepartmentKwargs = {
      url: '/api/productsubdepartments',
      successType: 'FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productSubDepartmentKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
