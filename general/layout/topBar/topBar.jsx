/*
 * Module dependencies
 */
import alertify from 'alertifyjs'
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    local: store.userProfile.activeLocal,
    config: store.config.globalConf
  }
})
export default class TopBar extends React.Component {

  menuClick(ev) {

    const mainContainer = document.getElementById('mainContainer')
    const sideMenu = document.getElementById('sideMenu')

    if (mainContainer.classList.contains('pulled')) {

      mainContainer.classList.remove('pulled')
      sideMenu.classList.remove('visible')
      return true
    }

    mainContainer.classList.add('pulled')
    sideMenu.classList.add('visible')

  }

  logOut() {

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

  // Main Layout
  render() {

    const localName = this.props.local ? this.props.local.name : ''
    const XMLVersionText = this.props.config ? this.props.config.overrideXMLversion : ''
    return <div className='topBar'>
      <div onClick={this.menuClick.bind(this)} className='topBar-button topBar-button-collapse not-visible' >
        <span className='fa fa-bars' />
      </div>
      <div className='topBar-right'>
        <div className='topBar-right-local'>
          {localName}
          <span>{` XML v${XMLVersionText}`}</span>
        </div>
        <div onClick={this.logOut.bind(this)} className='topBar-button topBar-button-logout'>
          <span className='fa fa-power-off' />
        </div>
      </div>
    </div>

  }

}
