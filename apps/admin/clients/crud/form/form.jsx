import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem } from '../../../../utils/api'

@connect((store) => {
  return {
    client: store.clients.clientActive,
    clients: store.clients.clients
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_CLIENT', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'code',
        url: '/api/clients/',
        lookUpValue: lookUp,
        dispatchType: 'SET_CLIENT',
        dispatchType2: 'SET_CLIENT_OLD',
        dispatchErrorType: 'CLIENT_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Clientes',
        redirectUrl: '/admin/clients',
        history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItem(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.client.id == '0000000000') {

        const kwargs = {
          lookUpField: 'code',
          url: '/api/clients/',
          lookUpValue: lookUp,
          dispatchType: 'SET_CLIENT',
          dispatchType2: 'SET_CLIENT_OLD',
          dispatchErrorType: 'CLIENT_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Clientes',
          redirectUrl: '/admin/clients',
          history: this.props.history
        }
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch(setItem(kwargs))

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

    const client = {
      ...this.props.client
    }

    client[name] = value

    this.props.dispatch({type: 'SET_CLIENT', payload: client})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  render() {

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-4 fields-container first'>

        <span>Datos generales</span>
        <hr />

        <div className='form-group'>
          <label>Código</label>
          <input value={this.props.client.code} name='code' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.client.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Apellidos</label>
          <input value={this.props.client.last_name} name='last_name' onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Tipo de Identificación</label>
          <select onChange={this.handleInputChange.bind(this)} className='form-control' name='id_type'
            value={this.props.client.id_type} >
            <option value='PER'>Cédula Física</option>
            <option value='JUR'>Cédula Jurídica</option>
            <option value='PAS'>Pasaporte</option>
          </select>
        </div>

        <div className='form-group'>
          <label>Identificación</label>
          <input value={this.props.client.id_num} onChange={this.handleInputChange.bind(this)} name='id_num' type='text'
            className='form-control' />
        </div>

      </div>

      <div className='col-xs-12 col-sm-4 fields-container buttons second'>

        <span>Contacto y tipo</span>
        <hr />

        <div className='form-group'>
          <label>Dirección</label>
          <input value={this.props.client.address} name='address' onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Teléfono</label>
          <input value={this.props.client.phone_number} name='phone_number' onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Celular</label>
          <input value={this.props.client.cellphone_number} name='cellphone_number'
            onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Email</label>
          <input value={this.props.client.email} name='email' onChange={this.handleInputChange.bind(this)} type='email'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Tipo</label>
          <select onChange={this.handleInputChange.bind(this)} className='form-control' name='client_type'
            value={this.props.client.client_type} >
            <option value='GENERAL'>Cliente General</option>
            <option value='DISTRIB'>Distribuidor</option>
            <option value='WHOLESA'>Mayorista</option>
          </select>
        </div>

      </div>

      <div className='col-xs-12 col-sm-4 fields-container buttons second'>

        <span>Crédito y Decuentos</span>
        <hr />

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Desc Máximo %</label>
            <input value={this.props.client.max_discount} name='max_discount'
              onChange={this.handleInputChange.bind(this)}
              type='number'
              className='form-control' onFocus={this.fieldFocus.bind(this)} />

          </div>

          <div className='col-xs-6 second'>

            <label>Desc Predet %</label>
            <input value={this.props.client.pred_discount} name='pred_discount'
              onChange={this.handleInputChange.bind(this)}
              type='number'
              className='form-control' onFocus={this.fieldFocus.bind(this)} />

          </div>
        </div>

        <div className='form-group'>
          <label>Desc Máx Línea %</label>
          <input value={this.props.client.max_line_discount} name='max_line_discount'
            onChange={this.handleInputChange.bind(this)} type='number'
            className='form-control' onFocus={this.fieldFocus.bind(this)} />
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Paga Impuestos</label>
            <input checked={this.props.client.pays_taxes} name='pays_taxes' onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />

          </div>

          <div className='col-xs-6 second'>

            <label>Tiene Crédito</label>
            <input checked={this.props.client.has_credit} name='has_credit' onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />

          </div>
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Límite de crédito</label>
            <input value={this.props.client.credit_limit} name='credit_limit' onChange={this.handleInputChange.bind(this)}
              type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />

          </div>

          <div className='col-xs-6 second'>

            <label>Días de crédito</label>
            <input value={this.props.client.credit_days} name='credit_days' onChange={this.handleInputChange.bind(this)}
              type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />

          </div>
        </div>

        <div className='form-group'>
          <label>Observaciones</label>
          <input value={this.props.client.observations} name='observations'
            onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
