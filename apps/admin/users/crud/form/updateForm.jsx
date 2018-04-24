import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem } from '../../../../../utils/api'

@connect((store) => {
  return {
    user: store.users.userActive,
    users: store.users.users,
    profile: store.users.userProfileActive
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_USER', payload: ''})
    this.props.dispatch({type: 'CLEAR_USERPROFILE', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'username',
        url: '/api/users/',
        lookUpValue: lookUp,
        dispatchType: 'SET_USER',
        dispatchType2: 'SET_USER_OLD',
        dispatchErrorType: 'USER_NOT_FOUND',
        lookUpName: 'Nombre de Usuario',
        modelName: 'Usuarios',
        redirectUrl: '/admin/users',
        history: this.props.history
      }

      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItem(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      if (nextProps.user.id != '0000000000' && nextProps.profile.user == '') {

        const kwargsProfile = {
          lookUpField: 'user',
          url: '/api/userprofiles/',
          lookUpValue: nextProps.user.id,
          dispatchType: 'SET_USERPROFILE',
          dispatchType2: 'SET_USERPROFILE_OLD',
          dispatchErrorType: 'USERPROFILE_NOT_FOUND',
          lookUpName: 'Usuario',
          modelName: 'Perfil de Usuario',
          redirectUrl: '/admin/users',
          history: this.props.history
        }

        const kwargs = {
          lookUpField: 'username',
          url: '/api/users/',
          lookUpValue: nextProps.user.username,
          dispatchType: 'SET_USER',
          dispatchType2: 'SET_USER_OLD',
          dispatchErrorType: 'USER_NOT_FOUND',
          lookUpName: 'Nombre de Usuario',
          modelName: 'Usuarios',
          redirectUrl: '/admin/users',
          history: this.props.history
        }

        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch(setItem(kwargsProfile))
        this.props.dispatch(setItem(kwargs))
      }
    }
  }

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value
    console.log(target.value)
    // const value = target.type === 'checkbox' ? target.checked : target.value
    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : 0
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name
    console.log(target.name)

    const user = {
      ...this.props.user
    }

    user[name] = value

    this.props.dispatch({type: 'SET_USER', payload: user})
  }

  handleInputProfileChange(event) {

    const target = event.target
    let value
    console.log(target.value)
    // const value = target.type === 'checkbox' ? target.checked : target.value
    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : 0
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name
    console.log(target.name)

    const profile = {
      ...this.props.profile
    }

    profile[name] = value

    this.props.dispatch({type: 'SET_USERPROFILE', payload: profile})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  render() {

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Datos generales</span>
        <hr />

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Usuario</label>
            <input value={this.props.user.username} name='username' onChange={this.handleInputChange.bind(this)} type='text'
              className='form-control' />
          </div>

          <div className='col-xs-6 second'>

            <label>Es Activo?</label>
            <input checked={this.props.user.is_active} name='is_active'
              onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />
          </div>
        </div>

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.user.first_name} name='first_name'
            onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Apellidos</label>
          <input value={this.props.user.last_name} name='last_name'
            onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

      </div>

      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Datos Adicionales</span>
        <hr />

        <div className='form-group'>
          <label>Identificación</label>
          <input value={this.props.profile.id_num} name='id_num'
            onChange={this.handleInputProfileChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Email</label>
          <input value={this.props.user.email} name='email'
            onChange={this.handleInputChange.bind(this)}
            type='email'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Fecha de Nacimiento</label>
          <input value={this.props.profile.birth_date} name='birth_date'
            onChange={this.handleInputProfileChange.bind(this)}
            type='date'
            className='form-control' />
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
