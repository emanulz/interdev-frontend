import React from 'react'
import {connect} from 'react-redux'
import {checkSupplierData} from '../../actions'
import {updateItem, getItemDoubleDispatch, deleteItem} from '../../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    supplier: store.suppliers.supplierActive,
    suppliers: store.suppliers.suppliers,
    supplierOld: store.suppliers.supplierActiveOld,
    user: store.user.user,
    permissions: store.suppliers.permissions
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const user = this.props.user
    const supplier = this.props.supplier
    const supplierOld = this.props.supplierOld
    const suppliers = this.props.suppliers
    const fieldsOk = checkSupplierData(supplier, suppliers)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/suppliers/${supplier.id}/`,
        baseUrl: `/api/suppliers/`,
        item: supplier,
        logCode: 'SUPPLIER_UPDATE',
        logDescription: 'Actualización de Proveedor',
        logModel: 'SUPPLIER',
        user: user,
        itemOld: supplierOld,
        sucessMessage: 'Proveedor actualizado Correctamente.',
        errorMessage: 'Hubo un error al actualizar el Proveedor, intente de nuevo.',
        dispatchType: 'CLEAR_SUPPLIER'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/suppliers'
        kwargs.history = this.props.history
      }

      const _this = this

      const updatePromise = new Promise((resolve, reject) => {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(updateItem(kwargs))
        resolve()
      })

      updatePromise.then(() => {
        console.log('THENNN')
        const supplierKwargs = {
          url: '/api/suppliers',
          successType: 'FETCH_SUPPLIERS_FULFILLED',
          successType2: 'CLEAR_SUPPLIER',
          errorType: 'FETCH_SUPPLIERS_REJECTED'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(getItemDoubleDispatch(supplierKwargs))
      }).catch((err) => {
        console.log(err)
      })

    }
  }

  deleteBtn() {

    const user = this.props.user
    const supplier = this.props.supplier
    const supplierOld = {noPrevious: 'No previous Item needed'}

    const _this = this
    const kwargs = {
      url: `/api/suppliers/${supplier.id}/`,
      item: supplier,
      logCode: 'SUPPLIER_DELETE',
      logDescription: 'Eliminación de Proveedor',
      logModel: 'SUPPLIER',
      user: user,
      itemOld: supplierOld,
      modelName: 'Proveedor',
      dispatchType: 'CLEAR_SUPPLIER',
      redirectUrl: '/admin/suppliers',
      history: this.props.history
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar el Proveedor ${supplier.code} - ${supplier.name} ${supplier.last_name}? Esta acción no se puede
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
