import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {saveItem} from '../../../../utils/api'
import {checkProductSubDepartmentData} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    productSubDepartment: store.productSubDepartments.productSubDepartmentActive,
    productSubDepartments: store.productSubDepartments.productSubDepartments,
    user: store.user.user
  }
})

class CreateButtons extends React.Component {

  // BUTTONS
  saveBtn(redirect) {
    const user = this.props.user
    const productSubDepartment = this.props.productSubDepartment
    const productSubDepartmentOld = {noPrevious: 'No previous Item needed'}
    const productSubDepartments = this.props.productSubDepartments
    const fieldsOk = checkProductSubDepartmentData(productSubDepartment, productSubDepartments)

    if (fieldsOk) {
      const kwargs = {
        url: '/api/productsubdepartments/',
        item: productSubDepartment,
        logCode: 'PRODUCT_SUBDEPARTMENT_CREATE',
        logDescription: 'Creación de nueva Sub Familia de producto',
        logModel: 'PRODUCT_SUBDEPARTMENT',
        user: user,
        itemOld: productSubDepartmentOld,
        sucessMessage: 'Sub Familia de producto creada Correctamente.',
        errorMessage: 'Hubo un error al crear la Sub familia de producto, intente de nuevo.',
        dispatchType: 'CLEAR_PRODUCT_SUBDEPARTMENT'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/productsubdepartments'
        kwargs.history = this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(saveItem(kwargs))
    }
  }

  backToList (event) {
    // ALERTIFY CONFIRM
    const _this = this
    alertify.confirm('No guardar', `¿Desea salir al menú sin guardar los cambios?`, function() {
      return true
    }, function() {
      _this.props.history.push('/admin/productsubdepartments')
    }).set('labels', {
      ok: 'Permanecer',
      cancel: 'No guardar'
    })

  }

  render() {
    // ********************************************************************
    // BUTTONS
    // ********************************************************************
    const buttons = <div className='col-xs-12 col-sm-6 row form-buttons-container-row'>
      <div className='col-xs-12'>
        <button onClick={this.saveBtn.bind(this, true)}
          className='form-buttons-container-save form-control btn-success inCol'>
          Guardar
        </button>
      </div>

      <div className='col-xs-12'>
        <button onClick={this.saveBtn.bind(this, false)}
          className='form-buttons-container-saveContinue form-control btn-primary inCol'>
          Guardar y agregar otro
        </button>
      </div>

      <div className='col-xs-12'>
        <button onClick={this.backToList.bind(this)}
          className='form-buttons-container-cancel form-control btn-danger inCol'>
          Cancelar
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
export default withRouter(CreateButtons)
