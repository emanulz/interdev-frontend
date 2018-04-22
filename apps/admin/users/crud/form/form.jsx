import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem } from '../../../../utils/api'

@connect((store) => {
  return {
    user: store.users.userActive,
    users: store.users.users
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_USER', payload: ''})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_USER', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'username',
        url: '/api/users/',
        lookUpValue: lookUp,
        dispatchType: 'SET_USER',
        dispatchType2: 'SET_USER_OLD',
        dispatchErrorType: 'USER_NOT_FOUND',
        lookUpName: 'código',
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

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.user.id == '0000000000') {

        const kwargs = {
          lookUpField: 'username',
          url: '/api/users/',
          lookUpValue: lookUp,
          dispatchType: 'SET_USER',
          dispatchType2: 'SET_USER_OLD',
          dispatchErrorType: 'USER_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Usuarios',
          redirectUrl: '/admin/users',
          history: this.props.history
        }
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
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

        <div className='form-group'>
          <label>Usuario</label>
          <input value={this.props.user.username} name='username' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Contraseña</label>
          <input value={this.props.user.password} name='password' onChange={this.handleInputChange.bind(this)}
            type='password'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Confirmar Contraseña</label>
          <input value={this.props.user.password2} name='password2' onChange={this.handleInputChange.bind(this)}
            type='password'
            className='form-control' />
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
