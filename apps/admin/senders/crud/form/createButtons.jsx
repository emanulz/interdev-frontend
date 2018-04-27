import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {saveItem} from '../../../../../utils/api'
import {checkClientData} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    sender: store.senders.senderActive,
    senders: store.senders.senders,
    user: store.user.user
  }
})

class CreateButtons extends React.Component {

  // BUTTONS
  saveBtn(redirect) {
    const user = this.props.user
    const sender = this.props.sender
    const senderOld = {noPrevious: 'No previous Item needed'}
    const senders = this.props.senders
    const fieldsOk = checkClientData(sender, senders)

    if (fieldsOk) {
      const kwargs = {
        url: '/api/senders/',
        item: sender,
        logCode: 'SENDER_CREATE',
        logDescription: 'Creación de nuevo Emisor',
        logModel: 'SENDER',
        user: user,
        itemOld: senderOld,
        sucessMessage: 'Emisor creado Correctamente.',
        errorMessage: 'Hubo un error al crear el Emisor, intente de nuevo.',
        dispatchType: 'CLEAR_SENDER'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/senders'
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
      _this.props.history.push('/admin/senders')
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
