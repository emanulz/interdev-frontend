/*
 * Module dependencies
 */
import React from 'react'
import routerBuilder from './routes.js'
import { checkUserPermissions } from '../../../utils/checkPermissions'
// import { getItemDispatch } from '../../../utils/api.js'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    //permissions: store.productDepartments.permissions
    helpModelsInUse: store.config.globalConf.helpModelsInUse,
  }
})
export default class List extends React.Component {

  componentWillMount() {

    // When will mount fecth for model permissions and dispatch to reducer
    // *******************************************************************
    // const permissions = {
    //   add: 'products.add_productdepartment',
    //   change: 'products.change_productdepartment',
    //   list: 'products.list_productdepartment',
    //   delete: 'products.delete_productdepartment'
    // }
    // const kwargs = {
    //   permissions: permissions,
    //   success: 'FETCH_USER_PRODUCT_DEPARTMENT_PERMISSIONS_FULLFILLED',
    //   fail: 'FETCH_USER_PRODUCT_DEPARTMENT_PERMISSIONS_REJECTED'
    // }
    // this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    // this.props.dispatch(checkUserPermissions(kwargs))
    // *******************************************************************

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    // const productDepartmentKwargs = {
    //   url: '/api/productdepartments',
    //   successType: 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED',
    //   errorType: 'FETCH_PRODUCT_DEPARTMENTS_REJECTED'
    // }
    // this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    // this.props.dispatch(getItemDispatch(productDepartmentKwargs))
    // *******************************************************************

  }

  // Main Layout
  render() {

    let helpers_names = []
    if(this.props.helpModelsInUse != undefined && 
      this.props.helpModelsInUse!="" && this.props.helpModelsInUse!=',')
    {

      helpers_names = this.props.helpModelsInUse.split(',')

    }

    return <div className='Main heigh100'>
      {routerBuilder(helpers_names)}
    </div>

  }

}
