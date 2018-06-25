import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem } from '../../../../../utils/api'

@connect((store) => {
  return {
    supplier: store.suppliers.supplierActive,
    suppliers: store.suppliers.suppliers
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_SUPPLIER', payload: ''})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_SUPPLIER', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'code',
        url: '/api/suppliers/',
        lookUpValue: lookUp,
        dispatchType: 'SET_SUPPLIER',
        dispatchType2: 'SET_SUPPLIER_OLD',
        dispatchErrorType: 'SUPPLIER_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Proveedores',
        redirectUrl: '/admin/suppliers',
        history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItem(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.supplier.id == '0000000000') {

        const kwargs = {
          lookUpField: 'code',
          url: '/api/suppliers/',
          lookUpValue: lookUp,
          dispatchType: 'SET_SUPPLIER',
          dispatchType2: 'SET_SUPPLIER_OLD',
          dispatchErrorType: 'SUPPLIER_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Proveedores',
          redirectUrl: '/admin/suppliers',
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

    const supplier = {
      ...this.props.supplier
    }

    supplier[name] = value

    this.props.dispatch({type: 'SET_SUPPLIER', payload: supplier})
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
          <input value={this.props.supplier.code} name='code' onChange={this.handleInputChange.bind(this)} type='text'
            placeholder='Dejar en blanco para código automático..'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.supplier.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Tipo de Identificación</label>
          <select onChange={this.handleInputChange.bind(this)} className='form-control' name='id_type'
            value={this.props.supplier.id_type} >
            <option value='PER'>Cédula Física</option>
            <option value='JUR'>Cédula Jurídica</option>
            <option value='PAS'>Pasaporte</option>
          </select>
        </div>

        <div className='form-group'>
          <label>Identificación</label>
          <input value={this.props.supplier.id_num} onChange={this.handleInputChange.bind(this)} name='id_num' type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Cuentas Bancarias</label>
          <textarea value={this.props.supplier.bank_accounts} name='bank_accounts'
            style={{resize: 'none'}}
            rows='4'
            onChange={this.handleInputChange.bind(this)}
            className='form-control' />
        </div>

      </div>

      <div className='col-xs-12 col-sm-4 fields-container buttons second'>

        <span>Contacto</span>
        <hr />

        <div className='form-group'>
          <label>Dirección</label>
          <input value={this.props.supplier.address} name='address' onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Teléfono</label>
          <input value={this.props.supplier.phone_number} name='phone_number' onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Celular</label>
          <input value={this.props.supplier.cellphone_number} name='cellphone_number'
            onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Email</label>
          <input value={this.props.supplier.email} name='email' onChange={this.handleInputChange.bind(this)} type='email'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Cuentas SINPE</label>
          <textarea value={this.props.supplier.sinpe_accounts} name='sinpe_accounts'
            style={{resize: 'none'}}
            rows='4'
            onChange={this.handleInputChange.bind(this)}
            className='form-control' />
        </div>

      </div>

      <div className='col-xs-12 col-sm-4 fields-container buttons second'>

        <span>Agente y Contacto</span>
        <hr />

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.supplier.agent_name} name='agent_name' onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Apellidos</label>
          <input value={this.props.supplier.agent_last_name} name='agent_last_name'
            onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Teléfono</label>
          <input value={this.props.supplier.agent_phone_number} name='agent_phone_number'
            onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Email</label>
          <input value={this.props.supplier.agent_email} name='agent_email' onChange={this.handleInputChange.bind(this)} type='email'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Observaciones</label>
          <textarea value={this.props.supplier.observations} name='observations'
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
