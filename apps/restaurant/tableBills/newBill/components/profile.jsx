import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {user: store.send.user, profile: store.send.profile}
})
export default class Profile extends React.Component {

  render() {

    const avatar = this.props.profile.avatar ? `/media/${this.props.profile.avatar}` : '/media/default/profile.jpg'

    const firstName = this.props.user.first_name
      ? this.props.user.first_name
      : (this.props.user.username
        ? this.props.user.username : 'DEBE ASIGNAR UN USUARIO')

    const lastName = this.props.user.last_name ? this.props.user.last_name : ''

    const fullName = `${firstName} ${lastName}`
    const username = this.props.user.username ? this.props.user.username : 'DEBE ASIGNAR UN USUARIO'

    return <div className='send-profile'>
      <div className='send-profile-avatar'>
        <img src={avatar} />
      </div>
      <div className='send-profile-data'>
        <h1>USUARIO RESPONSABLE</h1>
        <div className='send-profile-data-name'>
          <div>Nombre:</div>
          <div>{fullName}</div>
        </div>
        <div className='send-profile-data-user'>
          <div>Usuario:</div>
          <div>{username}</div>
        </div>
      </div>

    </div>

  }

}
