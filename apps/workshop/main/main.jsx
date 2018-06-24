import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import {fecthProfile} from './actions'
import routes from './routes'

// COMPONENTS

import TopBar from '../layout/topBar/topBar.jsx'
import SideMenu from '../layout/sideMenu/sideMenu.jsx'
import Fetching from '../../../general/fetching/fetching.jsx'

@connect((store) => {
    return {
      fetching: store.fetching.fetching,
      sideMenuVisible: store.layout.sideMenuVisible
    }
  })

export default class Main extends React.Component {

    componentWillMount() {
        this.props.dispatch(fecthProfile())
      }

    // Main layout
    render(){
        const fetching = this.props.fetching ? <Fetching /> : ''
        const mainContainerClass = this.props.sideMenuVisible ? 'mainContainer' : 'mainContainer sideHidden'
        const content = <Router>
          <div>
            <SideMenu />
            <div id='mainContainer' className={mainContainerClass}>
              <TopBar />
              <div className='mainContainer-content'>
                {routes}
                {fetching}
              </div>
            </div>
          </div>
        </Router>
    
        return <div>
          {content}
        </div>
      }
}