/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
import { getItemDispatch, loadGlobalConfig } from '../../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'

import {connect} from 'react-redux'
import RegisterClosure from '../registerClosure/registerClosure.jsx'

@connect((store) => {
  return {
  }
})
export default class Cashier extends React.Component {

  componentWillMount() {

    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))

    this.props.dispatch({type: 'CASHIER_PANEL_MOUNTED', payload: ''})
    const moneyBillsKwargs = {
      url: `/api/moneybills/?limit=100`,
      successType: 'FETCH_MONEY_BILLS_FULFILLED',
      errorType: 'FETCH_MONEY_BILLS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(moneyBillsKwargs))

  }
  // *******************************************************************
  // Main Layout
  render() {

    return <div className='cashier'>
      <RegisterClosure />
      <Content />
      <Aside />
    </div>

  }

}
