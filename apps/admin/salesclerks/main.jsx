/*
 * Module dependencies
 */
import React from 'react'
import routes from './routes.js'
import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Main extends React.Component {

  componentWillMount() {


  }

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
