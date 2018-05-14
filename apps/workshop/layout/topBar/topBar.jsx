/*
 * Module dependencies
 */
import React from 'react'
import alertify from 'alertifyjs'
import {toggleLayout} from './actions'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    topBarToggleVisible: store.layout.topBarToggleVisible
  }
})
export default class TopBar extends React.Component {

  menuClick(ev) {

    toggleLayout()

  }

  logOutClick() {

    // ALERTIFY CONFIRM
    alertify.confirm('Cerrar Sesión', `¿Desea Cerrar su sesión en el sistema?`, function() {
      window.location.replace('/logout')
    }, function() {
      return true
    }).set('labels', {
      ok: 'Cerrar',
      cancel: 'Permanecer'
    })
  }

  homeClick() {
    // ALERTIFY CONFIRM
    alertify.confirm('Ir al menú Principal', `¿Desea ir al menú principal?`, function() {
      window.location.replace('/')
    }, function() {
      return true
    }).set('labels', {
      ok: 'Ir',
      cancel: 'Permanecer'
    })
  }

  // Main Layout
  render() {
    const buttonClass = this.props.topBarToggleVisible
      ? 'topBar-button topBar-button-collapse visible' : 'topBar-button topBar-button-collapse'

    return <div className='topBar'>
      <div onClick={this.menuClick.bind(this)} className={buttonClass} >
        <span className='fa fa-bars' />
      </div>
      <div className='topBar-right'>
        <div onClick={this.homeClick.bind(this)} className='topBar-item topBar-item-config'>
          <span className='fa fa-home' />
        </div>
        <div onClick={this.logOutClick.bind(this)} className='topBar-button topBar-button-logout'>
          <span className='fa fa-power-off' />
        </div>
      </div>
    </div>

  }

}
