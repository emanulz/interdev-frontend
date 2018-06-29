/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.moneyReturn.fullWidth
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'moneyReturn-content' : 'moneyReturn-content blured'

    return <div className={contentClass}>
      <div className='moneyReturn-content-sale' >
        <div className='moneyReturn-content-sale-header'>
          VENTA REGISTRADA
        </div>
        <div className='moneyReturn-content-sale-content'>
          Content
        </div>
      </div>
      <div className='moneyReturn-content-return' >
        <div className='moneyReturn-content-return-header'>
          DEVOLUCIÓN
          <i className='fa fa-chevron-left' onClick={this.toggleWidth.bind(this)} />
        </div>
        <div className='moneyReturn-content-return-content'>
          Content
        </div>
      </div>
    </div>

  }

}
