import React from 'react'
import {connect} from 'react-redux'
import {getUserByCode} from '../actions.js'

@connect((store) => {
  return {
    code: store.pin.userCode, 
    pin: store.pin.userPin}
})
export default class PayCash extends React.Component {

  setCode(ev) {
    ev.preventDefault()
    const value = ev.target.value
    this.props.dispatch({type: 'SET_PIN_USER_CODE', payload: value})
  }

  setPin(ev) {
    ev.preventDefault()
    if (ev.key == 'Enter') {
      this.getUser()
    } else {
      const value = ev.target.value
      this.props.dispatch({type: 'SET_PIN_USER_PIN', payload: value})
    }
  }

  getUser() {
    const code = this.props.code
    const pin = this.props.pin
    // CALL THE CHECK USER AND PW METHOD
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getUserByCode(code, pin))
  }

  render() {

    return <div className='pin-method-body'>

      <div className='pin-method-body-header'>
        <span>Usuario</span>
      </div>

      <div className='pin-method-body-content'>
        <div className='pin-tag-inline'>
          <div className='first'>CÓDIGO:</div>
          <input value={this.props.code} onChange={this.setCode.bind(this)} type='Text' className='second' id='pin-pin'/>
        </div>
        <div className='pin-tag-inline'>
          <div className='first'>PIN:</div>

          <input className='second' value={this.props.pin} onChange={this.setPin.bind(this)} 
            onKeyUp={this.setPin.bind(this)} autoComplete='off' type='Password' id='pin-code'/>
          
        </div>

        <button
          className='btn btn-default tag-button' onClick={this.getUser.bind(this)}>
          Cargar Usuario
          <span>
            <i className='fa fa-user' />
          </span>
        </button>

        <br />
        <br />

      </div>

    </div>

  }

}
