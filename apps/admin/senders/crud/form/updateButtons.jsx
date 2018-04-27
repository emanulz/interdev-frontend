import React from 'react'
import {connect} from 'react-redux'
import {checkClientData} from '../../actions'
import {updateItem, getItemDoubleDispatch, deleteItem} from '../../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    sender: store.senders.senderActive,
    senders: store.senders.senders,
    senderOld: store.senders.senderActiveOld,
    user: store.user.user,
    permissions: store.senders.permissions
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const user = this.props.user
    const sender = this.props.sender
    const senderOld = this.props.senderOld
    const senders = this.props.senders
    const fieldsOk = checkClientData(sender, senders)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/senders/${sender.id}/`,
        baseUrl: `/api/senders/`,
        item: sender,
        logCode: 'SENDER_UPDATE',
        logDescription: 'Actualización de Emisor',
        logModel: 'SENDER',
        user: user,
        itemOld: senderOld,
        sucessMessage: 'Emisor actualizado Correctamente.',
        errorMessage: 'Hubo un error al actualizar el Emisor, intente de nuevo.',
        dispatchType: 'CLEAR_SENDER'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/senders'
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
        const senderKwargs = {
          url: '/api/senders',
          successType: 'FETCH_SENDERS_FULFILLED',
          successType2: 'CLEAR_SENDER',
          errorType: 'FETCH_SENDERS_REJECTED'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(getItemDoubleDispatch(senderKwargs))
      }).catch((err) => {
        console.log(err)
      })

    }
  }

  deleteBtn() {

    const user = this.props.user
    const sender = this.props.sender
    const senderOld = {noPrevious: 'No previous Item needed'}

    const _this = this
    const kwargs = {
      url: `/api/senders/${sender.id}/`,
      item: sender,
      logCode: 'SENDER_DELETE',
      logDescription: 'Eliminación de sendere',
      logModel: 'SENDER',
      user: user,
      itemOld: senderOld,
      modelName: 'Emisor',
      dispatchType: 'CLEAR_SENDER',
      redirectUrl: '/admin/senders',
      history: this.props.history
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar el Emisor ${sender.code} - ${sender.name} ${sender.last_name}? Esta acción no se puede
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
