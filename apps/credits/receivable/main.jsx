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
    permissions: store.clients.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    // TODO PERMISSIONS ON PAYABLE LIST EXAMPLE COMMENTED BELOW
    // const permissions = {
    //   add: 'products.add_product',
    //   change: 'products.change_product',
    //   list: 'products.list_product',
    //   delete: 'products.delete_product'
    // }
    // const kwargs = {
    //   permissions: permissions,
    //   success: 'FETCH_USER_PRODUCT_PERMISSIONS_FULLFILLED',
    //   fail: 'FETCH_USER_PRODUCT_PERMISSIONS_REJECTED'
    // }
    // this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    // this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const clientsKwargs = {
      url: '/api/clients',
      successType: 'FETCH_CLIENTS_FULFILLED',
      errorType: 'FETCH_CLIENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(clientsKwargs))
    // *******************************************************************

    // Then fetch the elements of the taxes model and dispatch to reducer
    // *******************************************************************
    const creditMovementsKwargs = {
      url: '/api/creditmovements',
      successType: 'FETCH_CREDIT_MOVEMENTS_FULFILLED',
      errorType: 'FETCH_CREDIT_MOVEMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(creditMovementsKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
