/*
 * Module dependencies
 */
import React from 'react'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'

import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Movements extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'PHYSICAL_TAKE_MOVEMENTS_PANEL_MOUNTED', payload: ''})
  }

  // Main Layout
  render() {

    return <div className='heigh100 take-movements'>
      <Content />
      <Aside />
    </div>

  }

}
