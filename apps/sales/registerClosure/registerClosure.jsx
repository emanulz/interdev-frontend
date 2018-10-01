/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
import { getSingleItemDispatch } from '../../../utils/api.js'

import {connect} from 'react-redux'

@connect((store) => {
  return {
    registerClosure: store.registerClosure.registerClosure
  }
})
export default class RegisterMovements extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'REGISTER_MOVEMENTS_PANEL_MOUNTED', payload: ''})
    const registerMovementsKwargs = {
      url: `/api/registerclosure/getregisterclosure/`,
      successType: 'FETCH_REGISTER_CLOSURE_FULFILLED',
      errorType: 'FETCH_REGISTER_CLOSURE_REJECTED'
    }

    this.props.dispatch(getSingleItemDispatch(registerMovementsKwargs))

  }
  componentWillUpdate(nextprops) {
    if (nextprops.registerClosure != this.props.registerClosure) {
      if (nextprops.registerClosure == false) {
        console.log('NOOOO CLOSURE OPEN')
      }
    }
  }
  // *******************************************************************
  // Main Layout
  render() {

    return null

  }

}
