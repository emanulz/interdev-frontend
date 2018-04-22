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
    permissions: store.productDepartments.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'products.add_productdepartment',
      change: 'products.change_productdepartment',
      list: 'products.list_productdepartment',
      delete: 'products.delete_productdepartment'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_PRODUCT_DEPARTMENT_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_PRODUCT_DEPARTMENT_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const productDepartmentKwargs = {
      url: '/api/productdepartments',
      successType: 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_DEPARTMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productDepartmentKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
