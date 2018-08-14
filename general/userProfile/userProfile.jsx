import React from 'react'
import {connect} from 'react-redux'
import {getProfileAndRelated} from './actions.js'
@connect((store) => {
  return {
    profile: store.userProfile.profile
  }
})
export default class UserProfile extends React.Component {

  componentWillMount() {
    this.props.dispatch(getProfileAndRelated())
  }
  // Main Layout
  render() {
    return null
  }

}
