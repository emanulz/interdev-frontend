/*
 * Module dependencies
 */
import React from 'react'
import routes from './routes.js'
// import { checkUserPermissions } from '../../../utils/checkPermissions'
import { getItemDispatch } from '../../../utils/api.js'
import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const productsKwargs = {
      url: '/api/products',
      successType: 'FETCH_PRODUCTS_FULFILLED',
      errorType: 'FETCH_PRODUCTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productsKwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const warehousesKwargs = {
      url: '/api/warehouses',
      successType: 'FETCH_WAREHOUSES_FULFILLED',
      errorType: 'FETCH_WAREHOUSES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(warehousesKwargs))
    // *******************************************************************

    const productDepartmentKwargs = {
      url: '/api/productdepartments',
      successType: 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_DEPARTMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productDepartmentKwargs))

    // *******************************************************************

    const productSubDepartmentKwargs = {
      url: '/api/productsubdepartments',
      successType: 'FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productSubDepartmentKwargs))

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
