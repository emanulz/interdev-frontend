import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import {clientSearchDoubleClick} from '../../actions.js'
import { setItemById } from '../../../../../utils/api'
import Search from '../../../../../general/search/search.jsx'

@connect((store) => {
  return {
    activity: store.activities.activityActive,
    activities: store.activities.activities
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_ACTIVITY', payload: ''})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_ACTIVITY', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        url: `/api/activities`,
        lookUpValue: lookUp,
        dispatchType: 'SET_ACTIVITY',
        dispatchType2: 'SET_ACTIVITY_OLD',
        dispatchErrorType: 'ACTIVITY_NOT_FOUND',
        lookUpName: 'Código',
        modelName: 'Actividades',
        redirectUrl: '/admin/activities',
        history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItemById(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.activity.id == '0000000000') {

        const kwargs = {
          lookUpField: 'consecutive',
          url: '/api/activities',
          lookUpValue: lookUp,
          dispatchType: 'SET_ACTIVITY',
          dispatchType2: 'SET_ACTIVITY_OLD',
          dispatchErrorType: 'ACTIVITY_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Actividades',
          redirectUrl: '/admin/activities',
          history: this.props.history
        }
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch(setItemById(kwargs))

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

    const activity = {
      ...this.props.activity
    }

    activity[name] = value

    this.props.dispatch({type: 'SET_ACTIVITY', payload: activity})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  render() {

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>
      {/* Mount the client search panel */}
      <Search modelText='Cliente' model='client' namespace='clientSearch' onRowDoubleClick={clientSearchDoubleClick} />
      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Datos generales</span>
        <hr />

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.activity.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Descripción</label>
          <textarea value={this.props.activity.description} name='description'
            style={{resize: 'none'}}
            rows='4'
            onChange={this.handleInputChange.bind(this)}
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Activo?</label>
          <input checked={this.props.activity.is_active} name='is_active'
            onChange={this.handleInputChange.bind(this)}
            type='checkbox' className='form-control' />
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
