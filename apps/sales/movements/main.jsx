/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
import { getItemDispatch, loadGlobalConfig } from '../../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import RegisterClosure from '../registerClosure/registerClosure.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    registerClosure: store.registerClosure.registerClosure
  }
})
export default class RegisterMovements extends React.Component {

  componentWillMount() {
    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
    this.props.dispatch({type: 'REGISTER_MOVEMENTS_PANEL_MOUNTED', payload: ''})
    const closureId = this.props.registerClosure ? this.props.registerClosure.id : 0
    const registerMovementsKwargs = {
      url: `/api/registermovements/?register_closure_id=${closureId}&limit=100000`,
      successType: 'FETCH_REGISTER_MOVEMENTS_FULFILLED',
      errorType: 'FETCH_REGISTER_MOVEMENTS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(registerMovementsKwargs))

  }
  componentWillUpdate(nextProps) {
    if (nextProps.registerClosure != this.props.registerClosure) {
      this.props.dispatch({type: 'REGISTER_MOVEMENTS_PANEL_MOUNTED', payload: ''})
      const closureId = nextProps.registerClosure ? nextProps.registerClosure.id : 0
      const registerMovementsKwargs = {
        url: `/api/registermovements/?register_closure_id=${closureId}&limit=100000`,
        successType: 'FETCH_REGISTER_MOVEMENTS_FULFILLED',
        errorType: 'FETCH_REGISTER_MOVEMENTS_REJECTED'
      }
      this.props.dispatch(getItemDispatch(registerMovementsKwargs))
    }
  }
  // *******************************************************************
  // Main Layout
  render() {

    return <div className='register-movements'>
      <RegisterClosure />
      <Content />
      <Aside />

    </div>

  }

}
