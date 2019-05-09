import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {saveItem} from '../../../../../utils/api'
import {checkProjectData} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    activity: store.activities.activityActive,
    activities: store.activities.activities,
    user: store.user.user
  }
})

class CreateButtons extends React.Component {

  // BUTTONS
  saveBtn(redirect) {
    const user = this.props.user
    const activity = this.props.activity
    const activityOld = {noPrevious: 'No previous Item needed'}
    const activities = this.props.activities
    const fieldsOk = checkProjectData(activity, activities)

    if (fieldsOk) {
      const kwargs = {
        url: '/api/activities/',
        item: activity,
        logCode: 'ACTIVITY_CREATE',
        logDescription: 'Creación de una nueva actividad',
        logModel: 'ACTIVITY',
        user: user,
        itemOld: activityOld,
        sucessMessage: 'Actividad creada Correctamente.',
        errorMessage: 'Hubo un error al crear la actividad, intente de nuevo.',
        dispatchType: 'CLEAR_ACTIVITY'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/activities'
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
      _this.props.history.push('/admin/activities')
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
      <div className='col-xs-12 col-sm-4'>
        <button onClick={this.saveBtn.bind(this, true)}
          className='form-buttons-container-save form-control btn-success inCol'>
          Guardar
        </button>
      </div>

      <div className='col-xs-12 col-sm-4'>
        <button onClick={this.saveBtn.bind(this, false)}
          className='form-buttons-container-saveContinue form-control btn-primary inCol'>
          Guardar y agregar otro
        </button>
      </div>

      <div className='col-xs-12 col-sm-4'>
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
