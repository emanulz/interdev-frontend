import React from 'react'
import {connect} from 'react-redux'
import {checkProductDepartmentData} from '../../actions'
import {deleteItem, generalSave} from '../../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    helper: store.helpers.helperActive,
    helpers: store.helpers.helpers,
    model: store.helpers.model,
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const helper = this.props.helper
    //const brands = this.props.brands
    //const fieldsOk = checkProductDepartmentData(productDepartment, productDepartments)
    const fieldsOk = true

    if (fieldsOk) {
      const model_name_upper = this.props.model.charAt(0).toUpperCase() + this.props.model.slice(1)
      const kwargs = {
        url: `/api/administration/${helper.id}/`,
        data: helper,
        method: 'patch',
        sucessMessage: `${model_name_upper} actualizada Correctamente.`,
        errorMessage: `Hubo un error al actualizar el modelo ${this.props.model}, revise los campos e intente de nuevo.`,
        successType: 'SET_HELPER',
        errorType: 'FETCHING_DONE'
      }

      if (redirect) {
        kwargs.redirectUrl = `/admin/helpers/${this.props.model}`
        kwargs.history = this.props.history
      }

      this.props.dispatch({type: 'FETCHING_STARTED'})
      this.props.dispatch(generalSave(kwargs))

    }
  }

  deleteBtn() {

    const helper = this.props.helper

    const kwargs = {
      url: `/api/administration/${helper.id}/`,
      dispatchType: 'CLEAR_HELPER',
      redirectUrl: `/admin/helpers/${this.props.model}`,
      history: this.props.history
    }
    
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar el objeto ${helper.code} - ${helper.name}?
                                  Esta acción no se puede deshacer.`,
    () => {
      this.props.dispatch({type: 'FETCHING_STARTED'})
      this.props.dispatch(deleteItem(kwargs))
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
    const buttons = true
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
