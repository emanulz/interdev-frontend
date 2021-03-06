import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import routes from './routes'
import {fecthProfile} from './actions'

import UserProfile from '../../../general/userProfile/userProfile.jsx'
import SingleProduct from '../../sales/general/product/singleProduct.jsx'
import GeneralItem from '../../sales/general/product/generalItem/generalItem.jsx'

import TopBar from '../layout/topBar/topBar.jsx'
import SideMenu from '../layout/sideMenu/sideMenu.jsx'
import Fetching from '../../../general/fetching/fetching.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'
import '../appstyles/main.sass'

@connect(store=>{
    return {
        fetching: store.fetching.fetching,
        sideMenuVisible: store.layout.sideMenuVisible
    }
})
export default class Main extends React.Component {

    componentWillMount(){
      this.props.dispatch(fecthProfile())
      this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
    }

    render(){

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
                <GeneralItem />
              </div>
            </div>
          </div>
        </Router>
    
        return <div>
          {content}
        </div>       
    }

}