/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {fecthProfile} from './actions'
import Filters from '../filters/filters.jsx'
import Products from '../products/products.jsx'
import SidePanel from '../sidePanel/sidePanel.jsx'

// COMPONENTS

import TopBar from '../../../general/layout/topBar/topBar.jsx'
import SideMenu from '../../../general/layout/sideMenu/sideMenu.jsx'
import Fetching from '../../../general/fetching/fetching.jsx'

// import routes from './routes.js'

@connect((store) => {
  return {
    fetching: store.fetching.fetching
  }
})
export default class Main extends React.Component {

  componentWillMount() {
    this.props.dispatch(fecthProfile())
  }

  // Main Layout
  render() {

    const fetching = this.props.fetching ? <Fetching /> : ''

    const content = <div>
      <SideMenu />
      <div id='mainContainer' className='mainContainer'>
        <TopBar />
        <div className='mainContainer-content'>
          <Filters />
          <Products />
          <SidePanel />
          {fetching}
        </div>
      </div>
    </div>

    return <div>
      {content}
    </div>
  }

}
