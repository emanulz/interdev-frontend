/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
import Content from './content/content.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'
import {connect} from 'react-redux'
import RegisterClosure from '../registerClosure/registerClosure.jsx'

@connect((store) => {
  return {
  }
})
export default class SingleRegisterMovement extends React.Component {

  componentWillMount() {
    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
  }

  // *******************************************************************
  // Main Layout
  render() {

    return <div className='single-register-movement'>
      <RegisterClosure />
      <Content />
    </div>

  }

}
