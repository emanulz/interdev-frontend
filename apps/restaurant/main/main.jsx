/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import {fecthProfile} from './actions'
import routes from './routes'
import {getItemDispatch, loadGlobalConfig} from '../../../utils/api.js'
import SingleProduct from '../../sales/general/product/singleProduct.jsx'
import UserProfile from '../../../general/userProfile/userProfile.jsx'

// COMPONENTS

import TopBar from '../layout/topBar/topBar.jsx'
import SideMenu from '../layout/sideMenu/sideMenu.jsx'
import Fetching from '../../../general/fetching/fetching.jsx'
import '../appstyles/main.sass'

// import routes from './routes.js'

@connect((store) => {
  return {
    fetching: store.fetching.fetching,
    sideMenuVisible: store.layout.sideMenuVisible
  }
})
export default class Main extends React.Component {

  componentWillMount() {
    this.props.dispatch(fecthProfile())
    const tablesKwargs = {
      url: '/api/restauranttables/?limit=200',
      successType: 'FETCH_TABLES_FULFILLED',
      errorType: 'FETCH_TABLES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(tablesKwargs))
    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
  }

  // Main Layout
  render() {

    const fetching = this.props.fetching ? <Fetching /> : ''
    const mainContainerClass = this.props.sideMenuVisible ? 'mainContainer' : 'mainContainer sideHidden'
    const content = <Router>
      <div>
        <UserProfile />
        <SideMenu />
        <div id='mainContainer' className={mainContainerClass}>
          <TopBar />
          <div className='mainContainer-content'>
            {routes}
            {fetching}
            <SingleProduct />
          </div>
        </div>
      </div>
    </Router>

    return <div>
      {content}
    </div>
  }

}
