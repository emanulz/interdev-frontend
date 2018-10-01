/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
import Content from './content/content.jsx'

import {connect} from 'react-redux'
import RegisterClosure from '../registerClosure/registerClosure.jsx'

@connect((store) => {
  return {
  }
})
export default class SingleRegisterMovement extends React.Component {

  // *******************************************************************
  // Main Layout
  render() {

    return <div className='single-register-movement'>
      <RegisterClosure />
      <Content />
    </div>

  }

}
