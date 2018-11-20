import React from 'react'
import {connect} from 'react-redux'
import {getUserByCode} from '../actions.js'

@connect((store) => {
  return {code: store.send.userCode, pin: store.send.userPin}
})
export default class PayCash extends React.Component {

  setCode(ev) {
    ev.preventDefault()
    if (ev.key == 'Enter') {
      document.getElementById('presaleCodePIN').focus()
    } else {
      const value = ev.target.value
      this.props.dispatch({type: 'SET_SEND_USER_CODE', payload: value})
    }
  }

  setPin(ev) {
    ev.preventDefault()
    if (ev.key == 'Enter') {
      this.getUser()
    } else {
      const value = ev.target.value
      this.props.dispatch({type: 'SET_SEND_USER_PIN', payload: value})
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

    return <div className='send-method-body'>

      <div className='send-method-body-header'>
        <span>Usuario</span>
      </div>

      <div className='send-method-body-content'>
        <div className='send-tag-inline'>
          <div className='first'>CÓDIGO:</div>
          <input id='presaleCodeInput' value={this.props.code} onChange={this.setCode.bind(this)} onKeyUp={this.setCode.bind(this)} type='Text' className='second' />
        </div>
        <div className='send-tag-inline'>
          <div className='first'>PIN:</div>
          <form className='second' onSubmit={e => { e.preventDefault() }}>
            <input id='presaleCodePIN' value={this.props.pin} onChange={this.setPin.bind(this)} onKeyUp={this.setPin.bind(this)} autoComplete='off' type='Password' />
          </form>
        </div>

        <button
          className='btn btn-default buttons-payButton' onClick={this.getUser.bind(this)}>
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
