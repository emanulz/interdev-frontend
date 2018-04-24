/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import {fecthProfile, fecthIsAdminLocked} from './actions'

// COMPONENTS

import TopBar from '../layout/topBar/topBar.jsx'
import SideMenu from '../layout/sideMenu/sideMenu.jsx'
import Configbar from '../layout/configBar/configBar.jsx'
import {hideConfigBar} from '../layout/configBar/actions'
import LockScreen from '../lockScreen/lockScreen.jsx'
import Fetching from '../../../general/fetching/fetching.jsx'

import routes from './routes.js'

@connect((store) => {
  return {
    adminLocked: store.lockScreen.adminLocked,
    fetching: store.fetching.fetching
  }
})
export default class Main extends React.Component {

  componentWillMount() {
    this.props.dispatch(fecthProfile())
    this.props.dispatch(fecthIsAdminLocked())
  }

  // Main Layout
  render() {

    const fetching = this.props.fetching ? <Fetching /> : ''

    const unlocked = <Router>
      <div>
        <SideMenu />
        <div id='mainContainer' className='blur-div mainContainer'>
          <TopBar />
          <Configbar />
          <div onClick={hideConfigBar} className='mainContainer-content'>
            {routes}
            {fetching}
          </div>
        </div>
      </div>
    </Router>

    const locked = <LockScreen />

    const content = this.props.adminLocked ? locked : unlocked

    return <div>
      {content}
    </div>
  }

}
