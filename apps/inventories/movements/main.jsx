/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
import { getItemDispatch } from '../../../utils/api.js'
import Content from './content/content.jsx'
import Filters from './filters/filters.jsx'
import SidePanel from './sidePanel/sidePanel.jsx'

import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Movements extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'MOVEMENTS_PANEL_MOUNTED', payload: ''})

    const productKwargs = {
      url: '/api/products',
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

    const inventoryMovementKwargs = {
      url: '/api/inventorymovements',
      successType: 'FETCH_INVENTORY_MOVEMENTS_FULFILLED',
      errorType: 'FETCH_INVENTORY_MOVEMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(inventoryMovementKwargs))

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
      <Filters />
      <Content />
      <SidePanel />

    </div>

  }

}
