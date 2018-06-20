import React from 'react'
import {connect} from 'react-redux'
import {checkClientCategoryData} from '../../actions'
import {updateItem, getItemDoubleDispatch, deleteItem} from '../../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    clientCategory: store.clientCategories.clientCategoryActive,
    clientCategories: store.clientCategories.clientCategories,
    clientCategoryOld: store.clientCategories.clientCategoryActiveOld,
    user: store.user.user,
    permissions: store.clientCategories.permissions
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const user = this.props.user
    const clientCategory = this.props.clientCategory
    const clientCategoryOld = this.props.clientCategoryOld
    const clientCategories = this.props.clientCategories
    const fieldsOk = checkClientCategoryData(clientCategory, clientCategories)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/clientcategories/${clientCategory.id}/`,
        baseUrl: `/api/clientcategories/`,
        item: clientCategory,
        logCode: 'CLIENT_CATEGORY_UPDATE',
        logDescription: 'Actualización de categoría de cliente',
        logModel: 'CLIENT_CATEGORY',
        user: user,
        itemOld: clientCategoryOld,
        sucessMessage: 'categoría de cliente actualizada Correctamente.',
        errorMessage: 'Hubo un error al actualizar la categoría de cliente, intente de nuevo.',
        dispatchType: 'CLEAR_CLIENT_CATEGORY'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/clientcategories'
        kwargs.history = this.props.history
      }

      const _this = this

      const updatePromise = new Promise((resolve, reject) => {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(updateItem(kwargs))
        resolve()
      })

      updatePromise.then(() => {
        const clientCategoryKwargs = {
          url: '/api/clientcategories',
          successType: 'FETCH_CLIENT_CATEGORY_FULFILLED',
          successType2: 'CLEAR_CLIENT_CATEGORY',
          errorType: 'FETCH_CLIENT_CATEGORYS_REJECTED'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(getItemDoubleDispatch(clientCategoryKwargs))
      }).catch((err) => {
        console.log(err)
      })

    }
  }

  deleteBtn() {

    const user = this.props.user
    const clientCategory = this.props.clientCategory
    const clientCategoryOld = {noPrevious: 'No previous Item needed'}

    const _this = this
    const kwargs = {
      url: `/api/clientcategories/${clientCategory.id}/`,
      item: clientCategory,
      logCode: 'CLIENT_CATEGORY_DELETE',
      logDescription: 'Eliminación de categoría de cliente',
      logModel: 'CLIENT_CATEGORY',
      user: user,
      itemOld: clientCategoryOld,
      modelName: 'Famlia de Producto',
      dispatchType: 'CLEAR_CLIENT_CATEGORY',
      redirectUrl: '/admin/clientcategories',
      history: this.props.history
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar la categoría de cliente ${clientCategory.code} - ${clientCategory.name}?
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
