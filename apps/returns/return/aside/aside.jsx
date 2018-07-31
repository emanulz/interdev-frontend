/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.preturn.fullWidth
  }
})
export default class Aside extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_RETURN_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render () {
    const asideClass = this.props.fullWidth ? 'return-aside collapsed' : 'return-aside'
    const asideContainerClass = this.props.fullWidth ? 'return-aside-content collapsed' : 'return-aside-content'
    return <div className={asideClass}>
      <div className={asideContainerClass}>
        {/* <div className='return-aside-arrow'>
          <div className='return-aside-arrow-container' onClick={this.toggleWidth.bind(this)}>
            <i className='fa fa-chevron-right' />
          </div>
        </div> */}
      </div>
      {/* <Buttons /> */}
      <div className='return-aside-total' >
        ₡ 0
        <i className='fa fa-chevron-right' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>
  }

}
