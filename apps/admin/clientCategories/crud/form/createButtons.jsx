import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {saveItem} from '../../../../../utils/api'
import {checkClientCategoryData} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    clientCategory: store.clientCategories.clientCategoryActive,
    clientCategories: store.clientCategories.clientCategories,
    user: store.user.user
  }
})

class CreateButtons extends React.Component {

  // BUTTONS
  saveBtn(redirect) {
    const user = this.props.user
    const clientCategory = this.props.clientCategory
    const clientCategoryOld = {noPrevious: 'No previous Item needed'}
    const clientCategories = this.props.clientCategories
    const fieldsOk = checkClientCategoryData(clientCategory, clientCategories)

    if (fieldsOk) {
      const kwargs = {
        url: '/api/clientcategories/',
        item: clientCategory,
        logCode: 'PRODUCT_DEPARTMENT_CREATE',
        logDescription: 'Creación de nueva categoría de cliente',
        logModel: 'PRODUCT_DEPARTMENT',
        user: user,
        itemOld: clientCategoryOld,
        sucessMessage: 'Categoría de cliente creada Correctamente.',
        errorMessage: 'Hubo un error al crear la categoría de cliente, intente de nuevo.',
        dispatchType: 'CLEAR_PRODUCT_DEPARTMENT'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/clientcategories'
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
      _this.props.history.push('/admin/clientcategories')
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
