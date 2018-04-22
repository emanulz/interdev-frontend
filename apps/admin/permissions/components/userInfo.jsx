/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    user: store.users.userActive,
    profile: store.users.userProfileActive
  }
})
export default class UserInfo extends React.Component {

  // Main Layout
  render() {
    const user = this.props.user
    const profile = this.props.profile

    const name = user ? `${user.first_name} ${user.last_name}` : ''
    const username = user ? user.username : ''

    const img = profile && profile.avatar ? profile.avatar : '/media/default/profile.jpg'

    const content = this.props.user.id != '0000000000'

      ? <div className='permissions-container-userinfo'>
        <div className='permissions-container-userinfo-image'>
          <img src={img} />
        </div>
        <div className='permissions-container-userinfo-data'>
          <div>
            <h2>Nombre:</h2>
            {name}
          </div>
          <div>
            <h2>Usuario:</h2>
            {username}
          </div>
        </div>
      </div>

      : <div />

    return <div>
      {content}
    </div>

  }

}
