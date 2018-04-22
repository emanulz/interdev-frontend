/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import {fecthProfile} from './actions'

// COMPONENTS

import TopBar from '../../layout/topBar/topBar.jsx'
import SideMenu from '../../layout/sideMenu/sideMenu.jsx'

@connect((store) => {
  return {
    profile: store.user.profile
  }
})
export default class Main extends React.Component {

  componentWillMount() {
    this.props.dispatch(fecthProfile())
  }

  componentDidMount() {
    document.getElementById('loader').remove()
  }

  // Main Layout
  render() {

    const unlocked = <Router>
      <div>
        <SideMenu />
        <div id='mainContainer' className='mainContainer'>
          <TopBar />

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
