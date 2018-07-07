/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import List from './list.jsx'

@connect((store) => {
  return {
  }
})
export default class Main extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'RETURNS_LIST_PANEL_MOUNTED', payload: ''})

  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      <List />
    </div>

  }

}
