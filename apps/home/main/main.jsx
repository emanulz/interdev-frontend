/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import {fecthProfile} from './actions'
import {loadGlobalConfig} from '../../../utils/api.js'
import { checkUserPermissions } from '../../../utils/checkPermissions.js'

// COMPONENTS

import TopBar from '../../../general/layout/topBar/topBar.jsx'
import SideMenu from '../../../general/layout/sideMenu/sideMenu.jsx'
import Body from '../body/body.jsx'

@connect((store) => {
  return {
    profile: store.user.profile
  }
})
export default class Main extends React.Component {

  componentWillMount() {
    this.props.dispatch(fecthProfile())
    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
    this.props.dispatch(loadGlobalConfig('installed_apps', false, 'FETCH_CONFIG_FULFILLED', 'FETCH_CONFIG_REJECTED'))

    const permissions = {
      access_administration: 'administration.access_administration',
      access_sales: 'administration.access_sales',
      access_presales: 'administration.access_presales',
      access_inventories: 'administration.access_inventories',
      access_workshop: 'administration.access_workshop',
      access_credits: 'administration.access_credits',
      access_purchases: 'administration.access_purchases',
      access_restaurant: 'administration.access_restaurant',
      access_returns: 'administration.access_returns',
      access_payables: 'administration.access_payables'
    }
    const kwargs = {
      permissions: permissions,
      success: 'FETCH_USER_ACCESS_PERMISSIONS_FULLFILLED',
      fail: 'FETCH_USER_ACCESS_PERMISSIONS_REJECTED'
    }
    this.props.dispatch(checkUserPermissions(kwargs))
  }

  // Main Layout
  render() {

    const unlocked = <Router>
      <div>
        <SideMenu />
        <div id='mainContainer' className='mainContainer'>
          <TopBar />
          <Body />
        </div>
      </div>
    </Router>

    // const content = this.props.adminLocked ? locked : unlocked
    const content = unlocked

    return <div>
      {content}
    </div>
  }

}
