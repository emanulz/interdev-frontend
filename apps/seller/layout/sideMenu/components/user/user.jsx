/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    user: store.user.user,
    profile: store.user.profile
  }
})
export default class User extends React.Component {

  // Main Layout
  render() {

    const avatar = this.props.profile.avatar ? `/media/${this.props.profile.avatar}` : '/media/default/profile.jpg'

    const name = this.props.user.first_name
      ? this.props.user.first_name
      : (this.props.user.username
        ? this.props.user.username : '')

    const lastName = this.props.user.last_name ? this.props.user.last_name : ''

    let fullName = `${name} ${lastName}`
    if (fullName.length > 22) fullName = fullName.substring(0, 22)

    return <div className='sideMenu-user col-xs-12 '>

      <div className='sideMenu-user-avatar'>
        <img src={avatar} />
      </div>

      <div className='sideMenu-user-name'>
        <span>{fullName}</span>
        <hr />
      </div>
    </div>

  }

}
