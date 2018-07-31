/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Sale extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'RETURN_PANEL_MOUNTED', payload: ''})
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
