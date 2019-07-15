import React from 'react'
import {connect} from 'react-redux'
import {getUserByCode} from '../actions.js'

@connect((store) => {
  return {code: store.send.userCode, pin: store.send.userPin}
})
export default class PayCash extends React.Component {

  setCode(ev) {
    ev.preventDefault()
    const value = ev.target.value
    this.props.dispatch({type: 'SET_SEND_USER_CODE', payload: value})
    // if (ev.key == 'Enter') {
    //   ev.preventDefault()
    // } else {
    //   const value = ev.target.value
    //   this.props.dispatch({type: 'SET_SEND_USER_CODE', payload: value})
    // }
  }

  focusPin (ev) {
    //alert(ev.key)
    if (ev.key == 'Enter') {
      //alert('ENTER ON CODE')
      document.getElementById('presaleCodePIN').focus()
    }
  }

  setPin(ev) {
    ev.preventDefault()
    const value = ev.target.value
    this.props.dispatch({type: 'SET_SEND_USER_PIN', payload: value})
    // if (ev.key == 'Enter') {
    //   ev.preventDefault()
    // } else {
    //   const value = ev.target.value
    //   this.props.dispatch({type: 'SET_SEND_USER_PIN', payload: value})
    // }
  }

  getUserByPin (ev) {
    
    if (ev.key == 'Enter') {
      ev.preventDefault()
      this.getUser()
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
          <input id='presaleCodeInput' value={this.props.code} onChange={this.setCode.bind(this)} onKeyPress={this.focusPin.bind(this)} type='Text' className='second mousetrap' />
        </div>
        <div className='send-tag-inline'>
          <div className='first'>PIN:</div>
          <form className='second' onSubmit={e => { e.preventDefault() }}>
            <input id='presaleCodePIN' value={this.props.pin} onChange={this.setPin.bind(this)} onKeyPress={this.getUserByPin.bind(this)} autoComplete='off' type='Password' className='mousetrap' />
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
