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
    permissions: store.products.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'products.add_product',
      change: 'products.change_product',
      list: 'products.list_product',
      delete: 'products.delete_product'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_PRODUCT_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_PRODUCT_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const productKwargs = {
      url: '/api/products',
      successType: 'FETCH_PRODUCTS_FULFILLED',
      errorType: 'FETCH_PRODUCTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productKwargs))
    // *******************************************************************

    // Then fetch the elements of the taxes model and dispatch to reducer
    // *******************************************************************
    const taxesKwargs = {
      url: '/api/taxes',
      successType: 'FETCH_TAXES_FULFILLED',
      errorType: 'FETCH_TAXES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(taxesKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
