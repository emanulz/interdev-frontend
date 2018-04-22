/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {assingUserPermission, checkSingleUserPermissions} from '../../../../utils/checkPermissions'

@connect((store) => {
  return {
    permissions: store.permissions.permissionsActive.users,
    user: store.users.userActive
  }
})
export default class Users extends React.Component {

  componentWillMount () {

    const permissions = {
      add: 'auth.add_user',
      change: 'auth.change_user',
      list: 'auth.list_user',
      delete: 'auth.delete_user'
    }
    const kwargs = {
      userId: this.props.user.id,
      model: 'users',
      permissions: permissions,
      success: 'SET_PERMISSIONS',
      fail: 'CLEAR_PERMISSIONS'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(checkSingleUserPermissions(kwargs))

  }

  handleInputChange (permission, event) {

    const target = event.target
    const value = target.checked

    // add is the variable to see if is checked or not
    const kwargs = {
      userId: this.props.user.id,
      model: 'users',
      add: value,
      permission: permission
    }

    const _this = this

    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(assingUserPermission(kwargs, resolve, reject))
    })

    updatePromise.then(() => {
      const permissions = {
        add: 'auth.add_user',
        change: 'auth.change_user',
        list: 'auth.list_user',
        delete: 'auth.delete_user'
      }
      const kwargs2 = {
        userId: this.props.user.id,
        model: 'users',
        permissions: permissions,
        success: 'SET_PERMISSIONS',
        fail: 'CLEAR_PERMISSIONS'
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(checkSingleUserPermissions(kwargs2))

    }).catch((err) => {
      console.log(err)
    })

  }

  // Main Layout
  render() {

    return <div className='permissions-container-permissions-tab'>

      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Listar Usuarios</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.list}
            onChange={this.handleInputChange.bind(this, 'list_user')} />
        </div>
      </div>

      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Crear Usuario</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.add}
            onChange={this.handleInputChange.bind(this, 'add_user')} />
        </div>
      </div>

      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Modificar Usuario</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.change}
            onChange={this.handleInputChange.bind(this, 'change_user')} />
        </div>
      </div>

      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Eliminar Usuario</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.delete}
            onChange={this.handleInputChange.bind(this, 'delete_user')} />
        </div>
      </div>

    </div>

  }

}
