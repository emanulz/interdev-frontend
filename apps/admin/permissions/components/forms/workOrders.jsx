/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {assingUserPermission, checkSingleUserPermissions} from '../../../../../utils/checkPermissions'

@connect((store) => {
  return {
    permissions: store.permissions.permissionsActive.work_orders,
    user: store.users.userActive
  }
})
export default class WorkOrders extends React.Component {

  componentWillMount () {

    const permissions = {
      add: 'workshop.add_work_order',
      change: 'workshop.change_work_order',
      list: 'workshop.list_work_order',
      delete: 'workshop.delete_work_order'
    }
    const kwargs = {
      userId: this.props.user.id,
      model: 'work_orders',
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
      model: 'work_orders',
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
        add: 'workshop.add_work_order',
        change: 'workshop.change_work_order',
        list: 'workshop.list_work_order',
        delete: 'workshop.delete_work_order'
      }
      const kwargs2 = {
        userId: this.props.user.id,
        model: 'work_orders',
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
        <div className='permissionName'>Listar ordenes de taller</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.list}
            onChange={this.handleInputChange.bind(this, 'list_work_order')} />
        </div>
      </div>

      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Crear orden de taller</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.add}
            onChange={this.handleInputChange.bind(this, 'add_work_order')} />
        </div>
      </div>

      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Modificar orden de taller</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.change}
            onChange={this.handleInputChange.bind(this, 'change_work_order')} />
        </div>
      </div>

      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Eliminar orden de taller</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.delete}
            onChange={this.handleInputChange.bind(this, 'delete_work_order')} />
        </div>
      </div>

    </div>

  }

}
