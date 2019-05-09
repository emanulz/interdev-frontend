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
    permissions: store.projects.permissions
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    const permissions = {
      add: 'construction.add_project',
      change: 'construction.change_project',
      list: 'construction.list_project',
      delete: 'construction.delete_project'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_PROJECT_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_PROJECT_PERMISSIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    // const projectKwargs = {
    //   url: '/api/productdepartments',
    //   successType: 'FETCH_PROJECTS_FULFILLED',
    //   errorType: 'FETCH_PROJECTS_REJECTED'
    // }
    // this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    // this.props.dispatch(getItemDispatch(projectKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
