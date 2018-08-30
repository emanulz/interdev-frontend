import React from 'react'
import {connect} from 'react-redux'
import {checkClientData} from '../../actions'
import {updateItem, getItemDoubleDispatch, deleteItem} from '../../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    client: store.clients.clientActive,
    clients: store.clients.clients,
    clientOld: store.clients.clientActiveOld,
    user: store.user.user,
    permissions: store.clients.permissions
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const user = this.props.user
    const client = this.props.client
    const clientOld = this.props.clientOld
    const clients = this.props.clients
    const fieldsOk = checkClientData(client, clients)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/clients/${client.id}/`,
        baseUrl: `/api/clients/`,
        item: client,
        logCode: 'CLIENT_UPDATE',
        logDescription: 'Actualización de cliente',
        logModel: 'CLIENT',
        user: user,
        itemOld: clientOld,
        sucessMessage: 'Cliente actualizado Correctamente.',
        errorMessage: 'Hubo un error al actualizar el Cliente, intente de nuevo.',
        dispatchType: 'CLEAR_CLIENT'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/clients'
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
        const clientKwargs = {
          url: '/api/clients',
          successType: 'FETCH_CLIENTS_FULFILLED',
          successType2: 'CLEAR_CLIENT',
          errorType: 'FETCH_CLIENTS_REJECTED'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(getItemDoubleDispatch(clientKwargs))
      }).catch((err) => {
        console.log(err)
      })

    }
  }

  deleteBtn() {

    const user = this.props.user
    const client = this.props.client
    const clientOld = {noPrevious: 'No previous Item needed'}

    const _this = this
    const kwargs = {
      url: `/api/clients/${client.id}/`,
      item: client,
      logCode: 'CLIENT_DELETE',
      logDescription: 'Eliminación de cliente',
      logModel: 'CLIENT',
      user: user,
      itemOld: clientOld,
      modelName: 'Cliente',
      dispatchType: 'CLEAR_CLIENT',
      redirectUrl: '/admin/clients',
      history: this.props.history
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar el Cliente ${client.code} - ${client.name} ${client.last_name}? Esta acción no se puede
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
