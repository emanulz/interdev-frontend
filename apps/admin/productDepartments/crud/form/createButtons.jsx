import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {saveItem} from '../../../../../utils/api'
import {checkProductDepartmentData} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    productDepartment: store.productDepartments.productDepartmentActive,
    productDepartments: store.productDepartments.productDepartments,
    user: store.user.user
  }
})

class CreateButtons extends React.Component {

  // BUTTONS
  saveBtn(redirect) {
    const user = this.props.user
    const productDepartment = this.props.productDepartment
    const productDepartmentOld = {noPrevious: 'No previous Item needed'}
    const productDepartments = this.props.productDepartments
    const fieldsOk = checkProductDepartmentData(productDepartment, productDepartments)

    if (fieldsOk) {
      const kwargs = {
        url: '/api/productdepartments/',
        item: productDepartment,
        logCode: 'PRODUCT_DEPARTMENT_CREATE',
        logDescription: 'Creación de nueva familia de producto',
        logModel: 'PRODUCT_DEPARTMENT',
        user: user,
        itemOld: productDepartmentOld,
        sucessMessage: 'Familia de producto creada Correctamente.',
        errorMessage: 'Hubo un error al crear la familia de producto, intente de nuevo.',
        dispatchType: 'CLEAR_PRODUCT_DEPARTMENT'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/productdepartments'
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
      _this.props.history.push('/admin/productdepartments')
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
