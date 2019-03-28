import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {generalSave} from '../../../../../utils/api'
import {checkProductDepartmentData} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    helper: store.helpers.helperActive,
    helpers: store.helpers.helpers,
    user: store.user.user,
    model: store.helpers.model,
  }
})

class CreateButtons extends React.Component {

  // BUTTONS
  saveBtn(redirect) {
    
    const helper = this.props.helper
    
    const helpers = this.props.helpers
    //const fieldsOk = checkProductDepartmentData(productDepartment, productDepartments)
    const fieldsOk = true

    const model_name_upper = this.props.model.charAt(0).toUpperCase() + this.props.model.slice(1)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/administration/?group=${this.props.model}`,
        data: helper,
        method: 'post',
        sucessMessage: `${model_name_upper} creada satisfactoriamente.`,
        errorMessage: `Hubo un error al crear el modelo ${this.props.model}, intente de nuevo.`,
        successType: 'CLEAR_HELPER',
        errorType: 'FETCHING_DONE'
      }

      if (redirect) {
        kwargs.redirectUrl = `/admin/helpers/${this.props.model}`
        kwargs.successType = 'CLEAR_HELPER',
        kwargs.history = this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED'})
      this.props.dispatch(generalSave(kwargs))
    }
  }

  backToList (event) {
    // ALERTIFY CONFIRM
    const _this = this
    alertify.confirm('No guardar', `¿Desea salir al menú sin guardar los cambios?`, function() {
      return true
    }, function() {
      _this.props.history.push(`/admin/helpers/${this.props.model}`)
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
