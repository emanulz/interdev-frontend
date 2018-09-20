/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    client: store.clientUpdatePanel.clientActive
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

    this.props.dispatch({type: 'SET_UPDATE_CLIENT', payload: client})
  }

  render() {

    return <div className='clientUpdatePanel-content-form'>

      <div className='clientUpdatePanel-content-form-inline'>
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

      <div className='clientUpdatePanel-content-form-inline'>
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
      <div className='clientUpdatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Tipo de Identificación</label>
          <div className='insideIcon'>
            <select onChange={this.handleInputChange.bind(this)} className='form-control' name='id_type'
              value={this.props.client.id_type} >
              <option value='01'>Cédula Física</option>
              <option value='02'>Cédula Jurídica</option>
              <option value='03'>Pasaporte</option>
            </select>
            <i className='fa fa-id-card' />
          </div>
        </div>
        <div className='form-group'>
          <label>Identificación</label>
          <div className='insideIcon'>
            <input value={this.props.client.id_num} name='id_num' onChange={this.handleInputChange.bind(this)} type='text'
              className='form-control' />
            <i className='fa fa-id-card' />
          </div>
        </div>

      </div>
    </div>

  }

}
