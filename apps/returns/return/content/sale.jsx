/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Sale extends React.Component {

  render() {

    return <div className='return-content-panels-sale'>
      <div className='cart'>
        <div className='cart-header'>
          <div className='cart-header-code'>
            <h5>Cód</h5>
          </div>
          <div className='cart-header-description'>
            <h5>Art</h5>
          </div>
          <div className='cart-header-qty'>
            <h5>Cant</h5>
          </div>
          <div className='cart-header-total'>
            <h5>Total IVI</h5>
          </div>
          <div className='cart-header-select'
          />
        </div>

      </div>
    </div>

  }

}
