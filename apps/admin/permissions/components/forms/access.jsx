/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {assingUserPermission, checkSingleUserPermissions} from '../../../../../utils/checkPermissions'

@connect((store) => {
  return {
    permissions: store.permissions.permissionsActive.access,
    user: store.users.userActive
  }
})
export default class Access extends React.Component {

  componentWillMount () {

    const permissions = {
      access_administration: 'administration.access_administration',
      access_sales: 'administration.access_sales',
      access_presales: 'administration.access_presales',
      access_inventories: 'administration.access_inventories'
    }
    const kwargs = {
      userId: this.props.user.id,
      model: 'access',
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
      model: 'access',
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
        access_administration: 'administration.access_administration',
        access_sales: 'administration.access_sales',
        access_presales: 'administration.access_presales',
        access_inventories: 'administration.access_inventories'
      }
      const kwargs2 = {
        userId: this.props.user.id,
        model: 'access',
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
        <div className='permissionName'>Accesar el sitio administrador</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.access_administration}
            onChange={this.handleInputChange.bind(this, 'access_administration')} />
        </div>
      </div>
      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Accesar app de Cajero</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.access_sales}
            onChange={this.handleInputChange.bind(this, 'access_sales')} />
        </div>
      </div>
      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Accesar app de Preventa</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.access_presales}
            onChange={this.handleInputChange.bind(this, 'access_presales')} />
        </div>
      </div>
      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Accesar app de Inventarios</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.access_inventories}
            onChange={this.handleInputChange.bind(this, 'access_inventories')} />
        </div>
      </div>

    </div>

  }

}
