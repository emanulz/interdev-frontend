import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import routes from './routes'

import UserProfile from '../../../general/userProfile/userProfile.jsx'
import SingleProduct from '../../sales/general/product/singleProduct.jsx'
import GeneralItem from '../../sales/general/product/generalItem/generalItem.jsx'

import TopBar from '../layout/topBar/topBar.jsx'
import SideMenu from '../layout/sideMenu/sideMenu.jsx'
import Fetching from '../../../general/fetching/fetching.jsx'


@connect(store=>{
    return {
        fetching: store.fetching.fetching,
        sideMenuVisible: store.layout.sideMenuVisible
    }
})
export default class Main extends React.Component {

    componentWillMount(){
       console.log("MAIN NOTES WILL MOUNT")
    }

    render(){
      console.log("Rendering main notes")
        const fetching = this.props.fetching ? <Fetching /> : ''
        const mainContainerClass = this.props.sideMenuVisible ? 'mainContainer' : 'mainContainer sideHidden'
        const content = <Router>
          <div>
            <UserProfile />
            <SideMenu />
            <div id='mainContainer' className={mainContainerClass}>
              <TopBar />
              <div className='mainContainer-content'>
                <h1>HOLY MONKEYS</h1>
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