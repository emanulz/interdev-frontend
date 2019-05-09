import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {saveItem} from '../../../../../utils/api'
import {checkProjectData} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    project: store.projects.projectActive,
    projects: store.projects.projects,
    user: store.user.user
  }
})

class CreateButtons extends React.Component {

  // BUTTONS
  saveBtn(redirect) {
    const user = this.props.user
    const project = {...this.props.project}
    project.activities = JSON.stringify(project.activities)

    const projectOld = {noPrevious: 'No previous Item needed'}
    const projects = this.props.projects
    const fieldsOk = checkProjectData(project, projects)

    if (fieldsOk) {
      const kwargs = {
        url: '/api/projects/',
        item: project,
        logCode: 'PROJECT_CREATE',
        logDescription: 'Creación de un nuevo proyecto',
        logModel: 'PROJECT',
        user: user,
        itemOld: projectOld,
        sucessMessage: 'Proyecto creado Correctamente.',
        errorMessage: 'Hubo un error al crear el proyecto, intente de nuevo.',
        dispatchType: 'CLEAR_PROJECT'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/projects'
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
      _this.props.history.push('/admin/projects')
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
