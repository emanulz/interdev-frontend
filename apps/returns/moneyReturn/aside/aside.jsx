/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Clients from '../../general/clients/clients.jsx'
import Save from './save/save.jsx'

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
          <Clients />
        </div>
        <div className='moneyReturn-aside-content-footer'>
          <Save />
        </div>
      </div>
    </div>
  }

}
