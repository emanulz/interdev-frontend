import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {saveItem} from '../../../../../utils/api'
import {checkData} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    user: store.users.userActive,
    users: store.users.users,
    userCreating: store.user.user
  }
})

class CreateButtons extends React.Component {

  // BUTTONS
  saveBtn(redirect) {
    const user = this.props.user
    const userCreating = this.props.userCreating
    const userOld = {noPrevious: 'No previous Item needed'}
    const users = this.props.users
    const fieldsOk = checkData(user, users)

    if (fieldsOk) {
      const kwargs = {
        url: '/api/users/',
        item: user,
        logCode: 'USER_CREATE',
        logDescription: 'Creación de nuevo usere',
        logModel: 'USER',
        user: userCreating,
        itemOld: userOld,
        sucessMessage: 'Usuario creado Correctamente.',
        errorMessage: 'Hubo un error al crear el Usuario, intente de nuevo.',
        dispatchType: 'CLEAR_USER'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/users'
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
      _this.props.history.push('/admin/users')
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
