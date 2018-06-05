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
    permissions: store.clients.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'clients.add_client',
      change: 'clients.change_client',
      list: 'clients.list_client',
      delete: 'clients.delete_client'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_CLIENT_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_CLIENT_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    // const clientKwargs = {
    //   url: '/api/clients',
    //   successType: 'FETCH_CLIENTS_FULFILLED',
    //   errorType: 'FETCH_CLIENTS_REJECTED'
    // }
    // this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    // this.props.dispatch(getItemDispatch(clientKwargs))
    // *******************************************************************

    // Then fetch provinces of the model and dispatch to reducer
    // *******************************************************************
    const provinceKwargs = {
      url: '/api/provinces',
      successType: 'FETCH_PROVINCES_FULFILLED',
      errorType: 'FETCH_PROVINCES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(provinceKwargs))
    // *******************************************************************

    // Then fetch cantons of the model and dispatch to reducer
    // *******************************************************************
    const cantonKwargs = {
      url: '/api/cantons',
      successType: 'FETCH_CANTONS_FULFILLED',
      errorType: 'FETCH_CANTONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(cantonKwargs))
    // *******************************************************************

    // Then fetch districts of the model and dispatch to reducer
    // *******************************************************************
    const districtKwargs = {
      url: '/api/districts',
      successType: 'FETCH_DISTRICTS_FULFILLED',
      errorType: 'FETCH_DISTRICTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(districtKwargs))
    // *******************************************************************

    // Then fetch towns of the model and dispatch to reducer
    // *******************************************************************
    const townKwargs = {
      url: '/api/towns',
      successType: 'FETCH_TOWNS_FULFILLED',
      errorType: 'FETCH_TOWNS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(townKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
