/*
 * Module dependencies
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
// import { checkUserPermissions } from '../../utils/checkPermissions'
import { getSingleItemDispatch } from '../../../utils/api.js'
import alertify from 'alertifyjs'

import {connect} from 'react-redux'

@connect((store) => {
  return {
    registerClosure: store.registerClosure.registerClosure,
    conf: store.config.globalConf
  }
})
class RegisterMovements extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'REGISTER_MOVEMENTS_PANEL_MOUNTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_REGISTER_CLOSURE', payload: ''})
    const registerMovementsKwargs = {
      url: `/api/registerclosure/getregisterclosure/`,
      successType: 'FETCH_REGISTER_CLOSURE_FULFILLED',
      errorType: 'FETCH_REGISTER_CLOSURE_REJECTED'
    }

    this.props.dispatch(getSingleItemDispatch(registerMovementsKwargs))

  }
  componentWillUpdate(nextprops) {
    if (nextprops.registerClosure != this.props.registerClosure || nextprops.conf != this.props.conf) {
      if (nextprops.registerClosure == false && nextprops.conf.usesRegisterClosure) {
        alertify.alert('CAJA CERRADA', 'Debe Abrir caja antes de registar movimientos')
        this.props.history.push('/sales/cashier')
      }
    }
  }
  // *******************************************************************
  // Main Layout
  render() {

    return null

  }

}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(RegisterMovements)
