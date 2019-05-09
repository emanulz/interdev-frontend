import React from 'react'
import {connect} from 'react-redux'
import {checkProjectData} from '../../actions'
import {updateItem, getItemDoubleDispatch, deleteItem} from '../../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    activity: store.activities.activityActive,
    activities: store.activities.activities,
    activityOld: store.activities.activityActiveOld,
    user: store.user.user,
    permissions: store.activities.permissions
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const user = this.props.user
    const activity = this.props.activity
    const activityOld = this.props.activityOld
    const activities = this.props.activities
    const fieldsOk = checkProjectData(activity, activities)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/activities/${activity.id}/`,
        baseUrl: `/api/activities/`,
        item: activity,
        logCode: 'ACTIVITY_UPDATE',
        logDescription: 'Actualización de Actividad',
        logModel: 'ACTIVITY',
        user: user,
        itemOld: activityOld,
        sucessMessage: 'Actividad actualizada Correctamente.',
        errorMessage: 'Hubo un error al actualizar la actividad, intente de nuevo.',
        dispatchType: 'CLEAR_ACTIVITY'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/activities'
        kwargs.history = this.props.history
      }

      const _this = this

      const updatePromise = new Promise((resolve, reject) => {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(updateItem(kwargs))
        resolve()
      })

      updatePromise.then(() => {
        const activityKwargs = {
          url: '/api/activities',
          successType: 'FETCH_ACTIVITY_FULFILLED',
          successType2: 'CLEAR_ACTIVITY',
          errorType: 'FETCH_ACTIVITIES_REJECTED'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(getItemDoubleDispatch(activityKwargs))
      }).catch((err) => {
        console.log(err)
      })

    }
  }

  deleteBtn() {

    const user = this.props.user
    const activity = this.props.activity
    const activityOld = {noPrevious: 'No previous Item needed'}

    const _this = this
    const kwargs = {
      url: `/api/activities/${activity.id}/`,
      item: activity,
      logCode: 'ACTIVITY_DELETE',
      logDescription: 'Eliminación de Actividad',
      logModel: 'ACTIVITY',
      user: user,
      itemOld: activityOld,
      modelName: 'Actividad',
      dispatchType: 'CLEAR_ACTIVITY',
      redirectUrl: '/admin/activities',
      history: this.props.history
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar la Actividad ${activity.id} - ${activity.name}?
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
      ? <div className='col-xs-12 col-sm-6 row form-buttons-container-row'>
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
