/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
import { getItemDispatch } from '../../../utils/api.js'
import List from './list/list.jsx'
import Create from './create/create.jsx'

import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Movements extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'PHYSICAL_TAKE_PANEL_MOUNTED', payload: ''})

    const productKwargs = {
      url: '/api/productslist',
      successType: 'FETCH_PRODUCTS_FULFILLED',
      errorType: 'FETCH_PRODUCTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productKwargs))

    const warehouseKwargs = {
      url: '/api/warehouses',
      successType: 'FETCH_WAREHOUSES_FULFILLED',
      errorType: 'FETCH_WAREHOUSES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(warehouseKwargs))

    const productDepartmentKwargs = {
      url: '/api/productdepartments',
      successType: 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_DEPARTMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productDepartmentKwargs))

    const productSubDepartmentKwargs = {
      url: '/api/productsubdepartments',
      successType: 'FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productSubDepartmentKwargs))

  }
  // *******************************************************************

  // Main Layout
  render() {

    return <div className='inventories-list'>
      <Create />
      <List />
    </div>

  }

}
