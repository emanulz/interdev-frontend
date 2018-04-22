import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {saveItem} from '../../../../utils/api'
import {checkSupplierData} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    supplier: store.suppliers.supplierActive,
    suppliers: store.suppliers.suppliers,
    user: store.user.user
  }
})

class CreateButtons extends React.Component {

  // BUTTONS
  saveBtn(redirect) {
    const user = this.props.user
    const supplier = this.props.supplier
    const supplierOld = {noPrevious: 'No previous Item needed'}
    const suppliers = this.props.suppliers
    const fieldsOk = checkSupplierData(supplier, suppliers)

    if (fieldsOk) {
      const kwargs = {
        url: '/api/suppliers/',
        item: supplier,
        logCode: 'SUPPLIER_CREATE',
        logDescription: 'Creación de nuevo Proveedor',
        logModel: 'SUPPLIER',
        user: user,
        itemOld: supplierOld,
        sucessMessage: 'Proveedor creado Correctamente.',
        errorMessage: 'Hubo un error al crear el proveedor, intente de nuevo.',
        dispatchType: 'CLEAR_SUPPLIER'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/suppliers'
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
      _this.props.history.push('/admin/suppliers')
    }).set('labels', {
      ok: 'Permanecer',
      cancel: 'No guardar'
    })

  }

  render() {
    // ********************************************************************
    // BUTTONS
    // ********************************************************************
    const buttons = <div className='col-xs-12 row form-buttons-container-row'>
      <div className='col-xs-12 col-sm-4'>
        <button onClick={this.saveBtn.bind(this, true)}
          className='form-buttons-container-save form-control btn-success'>
          Guardar
        </button>
      </div>

      <div className='col-xs-12 col-sm-4'>
        <button onClick={this.saveBtn.bind(this, false)}
          className='form-buttons-container-saveContinue form-control btn-primary'>
          Guardar y agregar otro
        </button>
      </div>

      <div className='col-xs-12 col-sm-4'>
        <button onClick={this.backToList.bind(this)}
          className='form-buttons-container-cancel form-control btn-danger'>
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
