import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getSingleItemDispatch } from '../../../../../utils/api'

@connect((store) => {
  return {
    helper: store.helpers.helperActive,
    helpers: store.helpers.helpers,
    user: store.user.user
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_HELPER'})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'id',
        url: `/api/administration/${lookUp}`,
        successType: 'SET_HELPER',
        errorType: 'HELPER_NOT_FOUND',
        //redirectUrl: '/admin/brands',
        //history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED'})
      this.props.dispatch(getSingleItemDispatch(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.helper.id == '0000000000') {

        const kwargs = {
          
          url: `/api/administration/${lookUp}`,
          lookUpValue: lookUp,
          successType: 'SET_HELPER',
          errorType: 'HELPER_NOT_FOUND'
        }
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch(getSingleItemDispatch(kwargs))

      }
    }
  }

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value
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

    const helper = {
      ...this.props.helper
    }

    helper[name] = value

    this.props.dispatch({type: 'SET_HELPER', payload: helper})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  render() {
    const valueField = this.props.user.is_staff
      ? <div className='form-group'>
        <label>Valor</label>
        <input value={this.props.helper.value} name='value' onChange={this.handleInputChange.bind(this)} type='number'
          className='form-control' onFocus={this.fieldFocus.bind(this)} />
      </div>
      : <div />
    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Datos generales</span>
        <hr />

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.helper.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Código</label>
          <input value={this.props.helper.code} name='code' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        {valueField}

        <div className='form-group'>
          <label>Observaciones</label>
          <textarea value={this.props.helper.description} name='description'
            style={{resize: 'none'}}
            rows='4'
            onChange={this.handleInputChange.bind(this)}
            className='form-control' />
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
