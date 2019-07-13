import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import {clientSearchDoubleClick, activitySearchDoubleClick, getProjectActivities} from '../../actions.js'
import { setItemById } from '../../../../../utils/api'
import Search from '../../../../../general/search/search.jsx'

@connect((store) => {
  return {
    project: store.projects.projectActive,
    projects: store.projects.projects,
    initialActivitiesFetched: store.projects.initialActivitiesFetched,
    initialProjectFetched: store.projects.initialProjectFetched,
    projectFetching: store.projects.projectFetching
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_PROJECT', payload: ''})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_PROJECT', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        url: `/api/projects`,
        lookUpValue: lookUp,
        dispatchType: 'SET_PROJECT',
        dispatchType2: 'SET_PROJECT_OLD',
        dispatchErrorType: 'PROJECT_NOT_FOUND',
        lookUpName: 'Código',
        modelName: 'Proyectos',
        redirectUrl: '/admin/projects',
        history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch({type: 'PROJECT_FETCHING', payload: ''})
      this.props.dispatch(setItemById(kwargs))

    }
  }

  componentDidUpdate(prevProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (this.props.project.id == '0000000000' && !this.props.initialProjectFetched && !this.props.projectFetching) {
        this.props.dispatch({type: 'PROJECT_FETCHING', payload: ''})
        const kwargs = {
          lookUpField: 'consecutive',
          url: '/api/projects',
          lookUpValue: lookUp,
          dispatchType: 'SET_PROJECT',
          dispatchType2: 'SET_PROJECT_OLD',
          dispatchErrorType: 'PROJECT_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Proyectos',
          redirectUrl: '/admin/projects',
          history: this.props.history
        }
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch(setItemById(kwargs))

      }
      if (this.props.project.id != '0000000000' && !this.props.initialActivitiesFetched && this.props.initialProjectFetched) {
        this.props.dispatch(getProjectActivities(`/api/projects/getRelatedActivities/?id_number=${this.props.project.id}`))
      }
    }
  }

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value
    console.log(target.value)
    // const value = target.type === 'checkbox' ? target.checked : target.value
    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : 0
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name
    console.log(target.name)

    const project = {
      ...this.props.project
    }

    project[name] = value

    this.props.dispatch({type: 'SET_PROJECT', payload: project})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  showClientSearch() {
    this.props.dispatch({type: 'clientSearch_TOGGLE_SEARCH_PANEL', payload: ''})
  }

  showActivitySearch() {
    this.props.dispatch({type: 'activitySearch_TOGGLE_SEARCH_PANEL', payload: ''})
  }

  removeActivityFromProject(id) {
    this.props.dispatch({type: 'REMOVE_ACTIVITY_FROM_PROJECT', payload: id})
  }

  render() {
    const client = this.props.project.client
    const clientName = client.id ? `${client.name} ${client.last_name}` : 'NO SELECCIONADO'

    const activities = this.props.project.activities.map(activity => {
      return <div key={activity.id} className='projectCreate-activities-element'>
        <span>{`${activity.id} - ${activity.name}`}</span>
        <span className='fa fa-trash projectCreate-activities-element-remove' onClick={this.removeActivityFromProject.bind(this, activity.id)} />
      </div>
    })
    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>
      {/* Mount the client search panel */}
      <Search modelText='Cliente' model='client' namespace='clientSearch' onRowDoubleClick={clientSearchDoubleClick} />
      <Search modelText='Actividad' model='activity' namespace='activitySearch' onRowDoubleClick={activitySearchDoubleClick} />
      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Datos generales</span>
        <hr />

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.project.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Descripción</label>
          <textarea value={this.props.project.description} name='description'
            style={{resize: 'none'}}
            rows='4'
            onChange={this.handleInputChange.bind(this)}
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Cliente</label>
          <div className='projectCreate-client'>
            <div className='projectCreate-client-name'>
              {clientName}
            </div>
            <div className='projectCreate-client-search' onClick={this.showClientSearch.bind(this)}>
              <span className='fa fa-search' />
            </div>
            <div className='projectCreate-client-add'>
              <span className='fa fa-plus' />
            </div>
          </div>
        </div>

        <div className='form-group'>
          <label>Activo?</label>
          <input checked={this.props.project.is_active} name='is_active'
            onChange={this.handleInputChange.bind(this)}
            type='checkbox' className='form-control' />
        </div>

      </div>
      <div className='col-xs-12 col-sm-6 fields-container second'>
        <span>Actividades</span>
        <hr />
        <div className='form-group'>
          <label>Actividad</label>
          <div className='projectCreate-client'>
            <div className='projectCreate-client-name'>
              ACTIVIDADES SELECCIONADAS
            </div>
            <div className='projectCreate-client-search' onClick={this.showActivitySearch.bind(this)}>
              <span className='fa fa-search' />
            </div>
            <div className='projectCreate-client-add'>
              <span className='fa fa-plus' />
            </div>
          </div>
        </div>
        <div className='form-group'>
          <div className='projectCreate-activities'>
            {activities}
          </div>
        </div>
      </div>
    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
