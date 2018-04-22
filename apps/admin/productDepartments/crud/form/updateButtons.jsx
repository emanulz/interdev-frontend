import React from 'react'
import {connect} from 'react-redux'
import {checkProductDepartmentData} from '../../actions'
import {updateItem, getItemDoubleDispatch, deleteItem} from '../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    productDepartment: store.productDepartments.productDepartmentActive,
    productDepartments: store.productDepartments.productDepartments,
    productDepartmentOld: store.productDepartments.productDepartmentActiveOld,
    user: store.user.user,
    permissions: store.productDepartments.permissions
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const user = this.props.user
    const productDepartment = this.props.productDepartment
    const productDepartmentOld = this.props.productDepartmentOld
    const productDepartments = this.props.productDepartments
    const fieldsOk = checkProductDepartmentData(productDepartment, productDepartments)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/productdepartments/${productDepartment.id}/`,
        baseUrl: `/api/productdepartments/`,
        item: productDepartment,
        logCode: 'PRODUCT_DEPARTMENT_UPDATE',
        logDescription: 'Actualización de Familia de producto',
        logModel: 'PRODUCT_DEPARTMENT',
        user: user,
        itemOld: productDepartmentOld,
        sucessMessage: 'Familia de producto actualizada Correctamente.',
        errorMessage: 'Hubo un error al actualizar la Familia de producto, intente de nuevo.',
        dispatchType: 'CLEAR_PRODUCT_DEPARTMENT'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/productdepartments'
        kwargs.history = this.props.history
      }

      const _this = this

      const updatePromise = new Promise((resolve, reject) => {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(updateItem(kwargs))
        resolve()
      })

      updatePromise.then(() => {
        const productDepartmentKwargs = {
          url: '/api/productdepartments',
          successType: 'FETCH_PRODUCT_DEPARTMENT_FULFILLED',
          successType2: 'CLEAR_PRODUCT_DEPARTMENT',
          errorType: 'FETCH_PRODUCT_DEPARTMENTS_REJECTED'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(getItemDoubleDispatch(productDepartmentKwargs))
      }).catch((err) => {
        console.log(err)
      })

    }
  }

  deleteBtn() {

    const user = this.props.user
    const productDepartment = this.props.productDepartment
    const productDepartmentOld = {noPrevious: 'No previous Item needed'}

    const _this = this
    const kwargs = {
      url: `/api/productdepartments/${productDepartment.id}/`,
      item: productDepartment,
      logCode: 'PRODUCT_DEPARTMENT_DELETE',
      logDescription: 'Eliminación de Familia de producto',
      logModel: 'PRODUCT_DEPARTMENT',
      user: user,
      itemOld: productDepartmentOld,
      modelName: 'Famlia de Producto',
      dispatchType: 'CLEAR_PRODUCT_DEPARTMENT',
      redirectUrl: '/admin/productdepartments',
      history: this.props.history
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar el productDepartmente ${productDepartment.code} - ${productDepartment.name}?
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
