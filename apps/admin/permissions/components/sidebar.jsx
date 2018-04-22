/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem } from '../../../utils/api'

@connect((store) => {
  return {
    users: store.users.users,
    filter: store.permissions.userFilter
  }
})
class SideBar extends React.Component {

  componentWillMount () {
    this.props.dispatch({type: 'CLEAR_USER', payload: ''})
    this.props.dispatch({type: 'CLEAR_USERPROFILE', payload: ''})
  }

  setInputFilter(event) {

    const target = event.target
    const value = target.value

    this.props.dispatch({type: 'SET_USER_FILTER', payload: value})
  }

  onUserClick(user, event) {

    this.props.dispatch({type: 'CLEAR_USER', payload: ''})
    this.props.dispatch({type: 'CLEAR_USERPROFILE', payload: ''})
    this.props.dispatch({type: 'CLEAR_PERMISSIONS', payload: ''})

    const kwargsProfile = {
      lookUpField: 'user',
      url: '/api/userprofiles/',
      lookUpValue: user.id,
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
      lookUpValue: user.username,
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

  // Main Layout
  render() {

    const filter = this.props.filter

    const filteredUsers = this.props.users.filter(user => {
      return user.first_name.indexOf(filter) > -1 || user.last_name.indexOf(filter) > -1 ||
      user.username.indexOf(filter) > -1
    })

    const users = filteredUsers.map(user => {
      const info = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username
      return <li onClick={this.onUserClick.bind(this, user)} key={user.id}>{info}</li>
    })

    return <div className='permissions-container-sidebar'>
      <h1>SELECCIÓN DE USUARIO</h1>
      <input type='text' className='form-control input' placeholder='Filtrar...'
        onChange={this.setInputFilter.bind(this)} />
      <ul>
        {users}
      </ul>

    </div>

  }

}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(SideBar)
