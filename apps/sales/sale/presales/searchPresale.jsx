/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    activeIndex: store.presales.activeIndex,
    activePresaleId: store.presales.activePresaleId
  }
})
export default class Product extends React.Component {
  // Render the product
  render() {
    return <div className='presales-panel-search' >
      <input className='mousetrap' type='text' id='presales-list-search-input' />
      <i className='fa fa-search' />
    </div>

  }

}
