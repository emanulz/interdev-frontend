/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    client: store.clientUpdatePanel.clientActive,
    clientLocal: store.clientUpdatePanel.clientLocalActive,
    canAssingCreditInSales: store.config.globalConf.canAssingCreditInSales
  }
})
export default class Form extends React.Component {

  componentDidUpdate(prevProps) {
    if (this.props.client.id != prevProps.client.id && this.props.client.id != '0000000000') {
      // HERE SET LOCAL TO DEFAULT
      const local = this.props.client.locals[0]
      this.props.dispatch({type: 'SET_UPDATE_CLIENT_LOCAL', payload: local})
    }
  }

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

  handleInputLocalChange(event) {
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

    const clientLocal = {
      ...this.props.clientLocal
    }

    clientLocal[name] = value

    this.props.dispatch({type: 'SET_UPDATE_CLIENT_LOCAL', payload: clientLocal})
  }

  handleLocalChange(ev) {
    const local = this.props.client.locals.find(local => {
      return local.id == ev.target.value
    })
    if (local) {
      this.props.dispatch({type: 'SET_UPDATE_CLIENT_LOCAL', payload: local})
    } else {
      alertify.alert('ERROR', 'No se encontró el local a editar.')
    }
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

    let locals = []
    if (this.props.client.locals) {
      locals = this.props.client.locals.map(local => {
        return {text: `${local.commercial_name ? local.commercial_name : 'SIN NOMBRE COMERCIAL'}`, id: local.id}
      })
    }

    const localsDiv = locals.length > 1
      ? <div className='clientUpdatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Local</label>
          <div className='insideIcon'>
            <Select2
              name='locals'
              data={locals}
              value={this.props.clientLocal ? this.props.clientLocal.id : 0}
              className='form-control'
              onSelect={this.handleLocalChange.bind(this)}
              options={{
                placeholder: 'Elija un Local...',
                noResultsText: 'Sin elementos'
              }}
            />
            <i className='fa fa-building' />
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

      {localsDiv}

      <div className='clientUpdatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Teléfono</label>
          <div className='insideIcon'>
            <input value={this.props.clientLocal ? this.props.clientLocal.phone_number : ''} name='phone_number' onChange={this.handleInputLocalChange.bind(this)} type='text'
              className='form-control' />
            <i className='fa fa-phone' />
          </div>
        </div>

        <div className='form-group'>
          <label>Email</label>
          <div className='insideIcon'>
            <input value={this.props.clientLocal ? this.props.clientLocal.email : ''} name='email' onChange={this.handleInputLocalChange.bind(this)} type='email'
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
