/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    client: store.clientUpdatePanel.clientActive,
    canAssingCreditInSales: store.config.globalConf.canAssingCreditInSales
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

    const canAssingCreditInSales = this.props.canAssingCreditInSales

    const creditDiv = canAssingCreditInSales
      ? <div className='clientCreatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Tiene Crédito</label>
          <div className='insideIcon'>
            <input checked={this.props.client.has_credit} name='has_credit' onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control creditCheckbox' />
            <i className='fa fa-credit-card' />
          </div>
        </div>

        <div className='form-group'>
          <label>Limite de Crédito</label>
          <div className='insideIcon'>
            <input value={this.props.client.credit_limit} name='credit_limit' onChange={this.handleInputChange.bind(this)}
              type='number' className='form-control' />
            <i className='fa fa-money' />
          </div>
        </div>
      </div>
      : <div />

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
      {creditDiv}
      <div className='clientUpdatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Tipo de Identificación</label>
          <div className='insideIcon'>
            <select onChange={this.handleInputChange.bind(this)} className='form-control' name='id_type'
              value={this.props.client.id_type} >
              <option value='01'>CÉDULA FÍSICA</option>
              <option value='02'>CÉDULA JURÍDICA</option>
              <option value='03'>DIMEX</option>
              <option value='04'>NITE</option>
              <option value='EXT'>IDENTIFICACIÓN EXTRANJEROS</option>
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
