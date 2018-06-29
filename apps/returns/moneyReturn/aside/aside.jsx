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
export default class Aside extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render () {
    const asideClass = this.props.fullWidth ? 'moneyReturn-aside collapsed' : 'moneyReturn-aside'
    const asideContainerClass = this.props.fullWidth ? 'moneyReturn-aside-content collapsed' : 'moneyReturn-aside-content'
    return <div className={asideClass}>
      <div className={asideContainerClass}>
        <div className='moneyReturn-aside-content-header'>
          INFORMACIÓN
          <i className='fa fa-chevron-right' onClick={this.toggleWidth.bind(this)} />
        </div>
        <div className='moneyReturn-aside-content-content'>
          Content
        </div>
      </div>
    </div>
  }

}
