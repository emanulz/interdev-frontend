/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Add extends React.Component {

  // Main Layout
  render() {

    return <div className='take-movements-content-add'>
      <div className='take-movements-content-add-container'>
        <input type='text' />
        <i className='fa fa-barcode' />
      </div>
      <div className='take-movements-content-add-search'>
        <i className='fa fa-search' />
      </div>
    </div>

  }

}
