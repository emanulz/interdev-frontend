/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
@connect((store) => {
  return {
    movement: store.singleRegisterMovement.singleRegisterMovementActive
  }
})
export default class Content extends React.Component {

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

    if (name == 'is_input') {
      if (value == 1) {
        value = true
      } else { value = false }
    }
    if (name == 'coin') {
      if (value == 1) {
        value = 'CRC'
      } else { value = 'USD' }
    }
    console.log(target.name)

    const movement = {
      ...this.props.movement
    }

    movement[name] = value

    this.props.dispatch({type: 'SET_SINGLE_REGISTER_MOVEMENT', payload: movement})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  // Main Layout
  render() {

    return <div className='register-single-movement-content col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-9 fields-container first'>

        <span>Movimiento manual de Caja:</span>
        <hr />

        <div className='form-group'>
          <label>Monto</label>
          <input value={this.props.movement.amount} name='amount' onChange={this.handleInputChange.bind(this)} type='number'
            className='form-control' onFocus={this.fieldFocus.bind(this)}/>
        </div>

        <div className='form-group'>
          <label>Tipo</label>
          <select onChange={this.handleInputChange.bind(this)} className='form-control' name='is_input'
            value={this.props.movement.is_input ? 1 : 2} >
            <option value='1'>Entrada</option>
            <option value='2'>Salida</option>
          </select>
        </div>

        <div className='form-group'>
          <label>Tipo</label>
          <select onChange={this.handleInputChange.bind(this)} className='form-control' name='coin'
            value={this.props.movement.coin == 'CRC' ? 1 : 2} >
            <option value='1'>Colones</option>
            <option value='2'>Dólares</option>
          </select>
        </div>

        <div className='form-group'>
          <label>Descripción</label>
          <input value={this.props.movement.description} name='description'
            onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' onFocus={this.fieldFocus.bind(this)} />
        </div>

        <div className='form-group'>
          <label>Documento de Referencia</label>
          <input value={this.props.movement.reference_doc} name='reference_doc'
            onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' onFocus={this.fieldFocus.bind(this)} />
        </div>

        <button className='btn btn-success'>Registrar</button>

      </div>

    </div>

  }

}
