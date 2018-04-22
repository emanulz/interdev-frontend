/*
 * Module dependencies
 */
import React from 'react'
import SideBar from './sidebar.jsx'
import UserInfo from './userInfo.jsx'
import Permissions from './permissions.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    permissions: store.users.permissions
  }
})
export default class Container extends React.Component {

  // Main Layout
  render() {

    return <div className='permissions-container'>
      <div className='permissions-container-aside'>
        <SideBar />
      </div>
      <div className='permissions-container-main'>
        <h1>USUARIO Y PERMISOS</h1>
        <UserInfo />
        <Permissions />
      </div>

    </div>

  }

}
