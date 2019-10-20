/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {assingUserProfile} from '../../../../../utils/checkPermissions'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    user: store.users.userActive
  }
})
export default class Access extends React.Component {

  applyProfile (event) {

    const value = document.getElementById('profile_to_apply_select').value

    const _this = this
    const kwargs = {
      profile: value,
      userId: this.props.user.id
    }
    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(assingUserProfile(kwargs, resolve, reject))
    })

    updatePromise.then(() => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log('PROFILE APPLIED')
      alertify.alert('COMPLETADO', `Perfil de Usuario aplicado correctamente`).set('onok', function(ev) {
        location.reload()
      })

    }).catch((err) => {
      alertify.alert('ERROR', `Error al assignar el perfil de usuario: ${err}`)
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
    })

  }

  // Main Layout
  render() {

    return <div className='permissions-container-permissions-tab'>
      <div className='permissions-container-permissions-tab-item'>
        <h2>Asignar Perfil al Usuario: </h2>
      </div>
      <div className='permissions-container-permissions-tab-item'>
        <select className='form-control' id='profile_to_apply_select'>
          <option value='SELLER'>Vendedor</option>
          <option value='CASHIER'>Cajero</option>
          <option value='CASHIER_CREDIT'>Cajero y Crédito</option>
        </select>
      </div>
      <div className='permissions-container-permissions-tab-item'>
        <button onClick={this.applyProfile.bind(this)} className='form-control btn btn-primary'>Aplicar</button>
      </div>
    </div>

  }

}
