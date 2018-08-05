/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'
import {setSale} from './actions.js'

import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Sale extends React.Component {

  componentWillMount() {

    this.props.dispatch(loadGlobalConfig('inventory', 'sales_warehouse', 'FETCH_SALES_WAREHOUSE_FULFILLED', 'FETCH_SALES_WAREHOUSE_REJECTED'))
    this.props.dispatch(loadGlobalConfig('inventory', 'workshop_warehouse', 'FETCH_WORKSHOP_WAREHOUSE_FULFILLED', 'FETCH_WORKSHOP_WAREHOUSE_REJECTED'))

    this.props.dispatch({type: 'RETURN_PANEL_MOUNTED', payload: ''})

    const lookUp = this.props.location.pathname.split('/').pop()

    const kwargs = {
      lookUpField: 'consecutive',
      url: '/api/saleslist/',
      lookUpValue: lookUp,
      dispatchType: 'SET_SALE',
      dispatchType2: 'SET_SALE_OLD',
      dispatchErrorType: 'SALE_NOT_FOUND',
      lookUpName: 'código',
      modelName: 'Ventas'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(setSale(kwargs))

  }
  // *******************************************************************
  // Main Layout
  render() {

    return <div className='return'>
      <Content />
      <Aside />

    </div>

  }

}
