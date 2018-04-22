/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {assingUserPermission, checkSingleUserPermissions} from '../../../../utils/checkPermissions'

@connect((store) => {
  return {
    permissions: store.permissions.permissionsActive.products,
    user: store.users.userActive
  }
})
export default class Products extends React.Component {

  componentWillMount () {

    const permissions = {
      add: 'products.add_product',
      change: 'products.change_product',
      list: 'products.list_product',
      delete: 'products.delete_product'
    }
    const kwargs = {
      userId: this.props.user.id,
      model: 'products',
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
      model: 'products',
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
        add: 'products.add_product',
        change: 'products.change_product',
        list: 'products.list_product',
        delete: 'products.delete_product'
      }
      const kwargs2 = {
        userId: this.props.user.id,
        model: 'products',
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
        <div className='permissionName'>Listar Productos</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.list}
            onChange={this.handleInputChange.bind(this, 'list_product')} />
        </div>
      </div>

      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Crear Producto</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.add}
            onChange={this.handleInputChange.bind(this, 'add_product')} />
        </div>
      </div>

      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Modificar Producto</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.change}
            onChange={this.handleInputChange.bind(this, 'change_product')} />
        </div>
      </div>

      <div className='permissions-container-permissions-tab-item'>
        <div className='permissionName'>Eliminar Producto</div>
        <div className='permissionInput'>
          <input type='checkbox' checked={this.props.permissions.delete}
            onChange={this.handleInputChange.bind(this, 'delete_product')} />
        </div>
      </div>

    </div>

  }

}
