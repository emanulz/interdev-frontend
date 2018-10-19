/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
import { getItemDispatch, getItemByIDDispatch } from '../../../../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    registerClosure: store.registerclosures.registerClosureActive
  }
})
export default class RegisterMovements extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_REGISTER_CLOSURE_ACTIVE_MOVEMENTS', payload: ''})

    const lookUpArray = this.props.location.pathname.split('/')
    const lookUp = lookUpArray[lookUpArray.length - 2]
    const registerMovementsKwargs = {
      url: `/api/registermovements/?register_closure_id=${lookUp}&limit=100000`,
      successType: 'FETCH_REGISTER_CLOSURE_MOVEMENTS_FULFILLED',
      errorType: 'FETCH_REGISTER_CLOSURE_MOVEMENTS_REJECTED'
    }
    this.props.dispatch(getItemDispatch(registerMovementsKwargs))

    const kwargs = {
      url: `/api/registerclosure/${lookUp}`,
      successType: 'FETCH_REGISTER_CLOSURE_FULFILLED',
      errorType: 'FETCH_REGISTER_CLOSURE_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemByIDDispatch(kwargs))
  }
  // *******************************************************************
  // Main Layout
  render() {

    return <div className='register-movements'>
      <Content />
      <Aside />

    </div>

  }

}
