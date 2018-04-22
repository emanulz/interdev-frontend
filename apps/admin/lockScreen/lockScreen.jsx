/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Clock from './clock/clock.jsx'
import {unlockAdmin} from './actions'

@connect((store) => {
  return {
    user: store.user.user,
    profile: store.user.profile
  }
})
export default class Main extends React.Component {

  componentDidMount() {
    document.getElementById('loader').classList.remove('loader')
  }

  passwordFieldChange(event) {
    if (event.key == 'Enter') {
      const target = event.target
      const value = target.value.toString()
      this.props.dispatch(unlockAdmin(value))
    }
  }

  // Main Layout
  render() {

    const avatar = this.props.profile.avatar ? `/media/${this.props.profile.avatar}` : '/media/default/profile.jpg'

    const name = this.props.user.first_name
      ? this.props.user.first_name
      : (this.props.user.username
        ? this.props.user.username : '')

    const lastName = this.props.user.last_name ? this.props.user.last_name : ''

    let fullName = `${name} ${lastName}`
    if (fullName.length > 17) fullName = fullName.substring(0, 17)

    return <div className='lockScreen'>
      <Clock />
      <div className='lockScreen-form'>
        <label>
          {fullName}
        </label>
        <img src={avatar} width='128' height='128' />
        <input type='password' placeholder='Password' id='lockFormGroup' className='form-control'
          onKeyUp={this.passwordFieldChange.bind(this)} />
      </div>
      <div className='lockScreen-logout'>
        <a href='/logout'>Desconectarse</a>
      </div>
    </div>
  }

}
