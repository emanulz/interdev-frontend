/*
 * Module dependencies
 */
import React from 'react'

export default class Unauthorized extends React.Component {

  // Main Layout
  render() {

    return <div className='List'>
      <h1>PERMISOS INSUFICIENTES</h1>
      <p>No tiene permiso para entar en esta página.</p>
    </div>
    
  }

}
