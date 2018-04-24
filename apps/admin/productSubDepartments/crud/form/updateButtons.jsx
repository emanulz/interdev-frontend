import React from 'react'
import {connect} from 'react-redux'
import {checkProductSubDepartmentData} from '../../actions'
import {updateItem, getItemDoubleDispatch, deleteItem} from '../../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    productSubDepartment: store.productSubDepartments.productSubDepartmentActive,
    productSubDepartments: store.productSubDepartments.productSubDepartments,
    productSubDepartmentOld: store.productSubDepartments.productSubDepartmentActiveOld,
    user: store.user.user,
    permissions: store.productSubDepartments.permissions
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const user = this.props.user
    const productSubDepartment = this.props.productSubDepartment
    const productSubDepartmentOld = this.props.productSubDepartmentOld
    const productSubDepartments = this.props.productSubDepartments
    const fieldsOk = checkProductSubDepartmentData(productSubDepartment, productSubDepartments)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/productsubdepartments/${productSubDepartment.id}/`,
        baseUrl: `/api/productsubdepartments/`,
        item: productSubDepartment,
        logCode: 'PRODUCT_SUBDEPARTMENT_UPDATE',
        logDescription: 'Actualización de Sub Familia de producto',
        logModel: 'PRODUCT_SUBDEPARTMENT',
        user: user,
        itemOld: productSubDepartmentOld,
        sucessMessage: 'Sub Familia de producto actualizada Correctamente.',
        errorMessage: 'Hubo un error al actualizar la Sub Familia de producto, intente de nuevo.',
        dispatchType: 'CLEAR_PRODUCT_SUBDEPARTMENT'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/productsubdepartments'
        kwargs.history = this.props.history
      }

      const _this = this

      const updatePromise = new Promise((resolve, reject) => {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(updateItem(kwargs))
        resolve()
      })

      updatePromise.then(() => {
        const productSubDepartmentKwargs = {
          url: '/api/productsubdepartments',
          successType: 'FETCH_PRODUCT_SUBDEPARTMENT_FULFILLED',
          successType2: 'CLEAR_PRODUCT_SUBDEPARTMENT',
          errorType: 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(getItemDoubleDispatch(productSubDepartmentKwargs))
      }).catch((err) => {
        console.log(err)
      })

    }
  }

  deleteBtn() {

    const user = this.props.user
    const productSubDepartment = this.props.productSubDepartment
    const productSubDepartmentOld = {noPrevious: 'No previous Item needed'}

    const _this = this
    const kwargs = {
      url: `/api/productsubdepartments/${productSubDepartment.id}/`,
      item: productSubDepartment,
      logCode: 'PRODUCT_SUBDEPARTMENT_DELETE',
      logDescription: 'Eliminación de Sub Familia de producto',
      logModel: 'PRODUCT_SUBDEPARTMENT',
      user: user,
      itemOld: productSubDepartmentOld,
      modelName: 'Sub Famlia de Producto',
      dispatchType: 'CLEAR_PRODUCT_SUBDEPARTMENT',
      redirectUrl: '/admin/productsubdepartments',
      history: this.props.history
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar la Sub Familia ${productSubDepartment.code} - ${productSubDepartment.name}?
                                  Esta acción no se puede deshacer.`,
    function() {
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
