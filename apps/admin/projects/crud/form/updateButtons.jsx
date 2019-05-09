import React from 'react'
import {connect} from 'react-redux'
import {checkProjectData} from '../../actions'
import {updateItem, getItemDoubleDispatch, deleteItem} from '../../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    project: store.projects.projectActive,
    projects: store.projects.projects,
    projectOld: store.projects.projectActiveOld,
    user: store.user.user,
    permissions: store.projects.permissions
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const user = this.props.user
    const project = {...this.props.project}
    project.activities = JSON.stringify(project.activities)
    const projectOld = this.props.projectOld
    const projects = this.props.projects
    const fieldsOk = checkProjectData(project, projects)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/projects/${project.id}/`,
        baseUrl: `/api/projects/`,
        item: project,
        logCode: 'PROJECT_UPDATE',
        logDescription: 'Actualización de Proyecto',
        logModel: 'PROJECT',
        user: user,
        itemOld: projectOld,
        sucessMessage: 'Proyecto actualizado Correctamente.',
        errorMessage: 'Hubo un error al actualizar el proyecto, intente de nuevo.',
        dispatchType: 'CLEAR_PROJECT'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/projects'
        kwargs.history = this.props.history
      }

      const _this = this

      const updatePromise = new Promise((resolve, reject) => {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(updateItem(kwargs))
        resolve()
      })

      updatePromise.then(() => {
        const projectKwargs = {
          url: '/api/projects',
          successType: 'FETCH_PROJECT_FULFILLED',
          successType2: 'CLEAR_PROJECT',
          errorType: 'FETCH_PROJECTS_REJECTED'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(getItemDoubleDispatch(projectKwargs))
      }).catch((err) => {
        console.log(err)
      })

    }
  }

  deleteBtn() {

    const user = this.props.user
    const project = this.props.project
    const projectOld = {noPrevious: 'No previous Item needed'}

    const _this = this
    const kwargs = {
      url: `/api/projects/${project.id}/`,
      item: project,
      logCode: 'PROJECT_DELETE',
      logDescription: 'Eliminación de Proyecto',
      logModel: 'PROJECT',
      user: user,
      itemOld: projectOld,
      modelName: 'Proyecto',
      dispatchType: 'CLEAR_PROJECT',
      redirectUrl: '/admin/projects',
      history: this.props.history
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar el Proyecto ${project.id} - ${project.name}?
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
