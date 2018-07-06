/*
 * Module dependencies
 */
import React from 'react'
import ReturnItems from './returnItems.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Return extends React.Component {

  // Main Layout
  render() {

    return <div className='cart'>
      <div className='cart-header'>
        <div className='cart-header-code'>
          <h5>Cód</h5>
        </div>
        <div className='cart-header-description'>
          <h5>Art</h5>
        </div>
        <div className='cart-header-qty alignLeft'>
          <h5>Cant</h5>
        </div>
        <div className='cart-header-total'>
          <h5>Total IVI</h5>
        </div>
      </div>

      <ReturnItems />

    </div>

  }

}
