import React from 'react'
import {connect} from 'react-redux'
import {checkWarehouseData} from '../../actions'
import {updateItem, getItemDoubleDispatch, deleteItem} from '../../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    warehouse: store.warehouses.warehouseActive,
    warehouses: store.warehouses.warehouses,
    warehouseOld: store.warehouses.warehouseActiveOld,
    user: store.user.user,
    permissions: store.warehouses.permissions
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const user = this.props.user
    const warehouse = this.props.warehouse
    const warehouseOld = this.props.warehouseOld
    const warehouses = this.props.warehouses
    const fieldsOk = checkWarehouseData(warehouse, warehouses)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/warehouses/${warehouse.id}/`,
        baseUrl: `/api/warehouses/`,
        item: warehouse,
        logCode: 'WAREHOUSE_UPDATE',
        logDescription: 'Actualización de warehousee',
        logModel: 'WAREHOUSE',
        user: user,
        itemOld: warehouseOld,
        sucessMessage: 'Bodega actualizada Correctamente.',
        errorMessage: 'Hubo un error al actualizar la Bodega, intente de nuevo.',
        dispatchType: 'CLEAR_WAREHOUSE'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/warehouses'
        kwargs.history = this.props.history
      }

      const _this = this

      const updatePromise = new Promise((resolve, reject) => {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(updateItem(kwargs))
        resolve()
      })

      updatePromise.then(() => {
        const warehouseKwargs = {
          url: '/api/warehouses',
          successType: 'FETCH_WAREHOUSES_FULFILLED',
          successType2: 'CLEAR_WAREHOUSE',
          errorType: 'FETCH_WAREHOUSES_REJECTED'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(getItemDoubleDispatch(warehouseKwargs))
      }).catch((err) => {
        console.log(err)
      })

    }
  }

  deleteBtn() {

    const user = this.props.user
    const warehouse = this.props.warehouse
    const warehouseOld = {noPrevious: 'No previous Item needed'}

    const _this = this
    const kwargs = {
      url: `/api/warehouses/${warehouse.id}/`,
      item: warehouse,
      logCode: 'WAREHOUSE_DELETE',
      logDescription: 'Eliminación de warehousee',
      logModel: 'WAREHOUSE',
      user: user,
      itemOld: warehouseOld,
      modelName: 'Bodega',
      dispatchType: 'CLEAR_WAREHOUSE',
      redirectUrl: '/admin/warehouses',
      history: this.props.history
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar la Bodega ${warehouse.code} - ${warehouse.name}? Esta acción no se puede
    deshacer.`, function() {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(deleteItem(kwargs))
    }, function() {
      return true
    }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  render() {
    // ********************************************************************
    // BUTTONS
    // ********************************************************************

    // IF HAVE PERISSION SHOW DELETE BTN
    const buttons = this.props.permissions.delete
      ? <div className='col-xs-12 row form-buttons-container-row'>
        <div className='col-xs-12 col-sm-4'>
          <button onClick={this.updateBtn.bind(this, true)}
            className='form-buttons-container-save form-control btn-success'>
            Actualizar
          </button>
        </div>

        <div className='col-xs-12 col-sm-4'>
          <button onClick={this.updateBtn.bind(this, false)}
            className='form-buttons-container-saveContinue form-control btn-primary'>
            Actualizar y Seguir
          </button>
        </div>

        <div className='col-xs-12 col-sm-4'>
          <button onClick={this.deleteBtn.bind(this)} className='form-buttons-container-cancel form-control btn-danger'>
            Eliminar
          </button>
        </div>
      </div>

      // IF DO NOT HAVE PERMISSION DONT SHOW DELETE BTN
      : <div className='col-xs-12 row form-buttons-container-row'>
        <div className='col-xs-12 col-sm-4'>
          <button onClick={this.updateBtn.bind(this, true)}
            className='form-buttons-container-save form-control btn-success'>
            Actualizar
          </button>
        </div>

        <div className='col-xs-12 col-sm-4'>
          <button onClick={this.updateBtn.bind(this, false)}
            className='form-buttons-container-saveContinue form-control btn-primary'>
            Actualizar y Seguir
          </button>
        </div>

      </div>

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='form-buttons-container'>
      {buttons}
    </div>

  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(UpdateButtons)
