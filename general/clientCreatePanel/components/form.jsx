/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    client: store.clientCreatePanel.clientActive,
    autoCode: store.clientCreatePanel.autoCode
  }
})
export default class Form extends React.Component {

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value
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
      case 'select-one':
      {
        this.clearAdrresses(target.name)
        value = target.value
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const client = {
      ...this.props.client
    }

    client[name] = value

    this.props.dispatch({type: 'SET_CREATE_CLIENT', payload: client})
  }

  handleAutoCodeChange(event) {
    const target = event.target
    const value = target.checked
    this.props.dispatch({type: 'SET_CREATE_CLIENT_AUTO_CODE', payload: value})
  }

  render() {

    return <div className='clientCreatePanel-content-form'>
      <div className='clientCreatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Código Automático</label>
          <input checked={this.props.autoCode} name='autoCode' onChange={this.handleAutoCodeChange.bind(this)}
            type='checkbox' className='form-control' />
        </div>
        <div className='form-group'>
          <label>Código</label>
          <div className='insideIcon'>
            <input disabled={this.props.autoCode} value={this.props.client.code} name='code' onChange={this.handleInputChange.bind(this)} type='text'
              className='form-control' />
            <i className='fa fa-keyboard-o' />
          </div>
        </div>
      </div>

      <div className='clientCreatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Nombre</label>
          <div className='insideIcon'>
            <input value={this.props.client.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
              className='form-control' />
            <i className='fa fa-user' />
          </div>
        </div>

        <div className='form-group'>
          <label>Apellidos</label>
          <div className='insideIcon'>
            <input value={this.props.client.last_name} name='last_name' onChange={this.handleInputChange.bind(this)}
              type='text'
              className='form-control' />
            <i className='fa fa-users' />
          </div>
        </div>
      </div>

      <div className='clientCreatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Teléfono</label>
          <div className='insideIcon'>
            <input value={this.props.client.phone_number} name='phone_number' onChange={this.handleInputChange.bind(this)} type='text'
              className='form-control' />
            <i className='fa fa-phone' />
          </div>
        </div>

        <div className='form-group'>
          <label>Email</label>
          <div className='insideIcon'>
            <input value={this.props.client.email} name='email' onChange={this.handleInputChange.bind(this)} type='email'
              className='form-control' />
            <i className='fa fa-at' />
          </div>
        </div>
      </div>

    </div>

  }

}
