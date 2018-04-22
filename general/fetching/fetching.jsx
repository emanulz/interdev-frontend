/*
 * Module dependencies
 */
import React from 'react'

export default class Fetching extends React.Component {

  // Main Layout
  render() {

    return <div className='fetcing-container'>
      <img src={'/static/vendor/loaders/Eclipse.gif'} />
      <h1>Cargando elementos</h1>
    </div>

  }

}
