/*
 * Module dependencies
 */
import React from 'react'
import routes from './routes.js'

export default class Main extends React.Component {

  // Main Layout
  render() {

    return <div className='Main heigh100'>
      {routes}
    </div>

  }

}
