/*
 * Module dependencies
 */
import React from 'react'
import alertify from 'alertifyjs'
import {toggleLayout, toggleConfigBar} from './actions'

export default class TopBar extends React.Component {

  menuClick(ev) {

    toggleLayout()

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

  configClick() {
    toggleConfigBar()
  }

  // Main Layout
  render() {

    return <div className='topBar'>
      <div onClick={this.menuClick.bind(this)} className='topBar-button topBar-button-collapse not-visible' >
        <span className='fa fa-bars' />
      </div>

      <div className='topBar-right'>
        <div onClick={this.homeClick.bind(this)} className='topBar-item topBar-item-config'>
          <span className='fa fa-home' />
        </div>
        <div onClick={this.configClick.bind(this)} className='topBar-item topBar-item-config last-item'>
          <span className='fa fa-cogs' />
        </div>
        <div onClick={this.logOutClick.bind(this)} className='topBar-button topBar-button-logout'>
          <span className='fa fa-power-off' />
        </div>
      </div>
    </div>

  }

}
