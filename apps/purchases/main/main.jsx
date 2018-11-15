import React from 'react'
import {connect} from 'react-redux'
import routes from './routes'
import {fetchProfile} from './actions'
import {BrowserRouter as Router} from 'react-router-dom'
import {fetchGlobalPreferences} from './actions.js'
import {productSearchDoubleClick} from '../general/product/actions.js'
import UserProfile from '../../../general/userProfile/userProfile.jsx'

//components
import TopBar from '../layout/topBar/topBar.jsx'
import SideMenu from '../layout/sideMenu/sideMenu.jsx'
import Fetching from '../../../general/fetching/fetching.jsx'
import Search from '../../../general/search/search.jsx'
import ReceiptPanel from '../general/receipt/receiptPanel/receiptPanel.jsx'

import '../appstyles/main.sass'


@connect(store=>{
    return {
        fetching: store.fetching.fetching,
        sideMenuVisible: store.layout.sideMenuVisible,
        cartItems: store.cart.cartItems,
    }
})
export default class Main extends React.Component {

    componentWillMount(){
        this.props.dispatch(fetchProfile())
        this.props.dispatch(fetchGlobalPreferences())

    }

    render () {
        const fetching = this.props.fetching ? < Fetching/> : ''
        const mainContainerClass = this.props.sideMenuVisible ? 'mainContainer': 'mainContainer sideHidden'
        const content = <Router>
            <div>
                <UserProfile />
                <Search modelText='Productos' model='product' namespace='productSearch' onRowDoubleClick={productSearchDoubleClick.bind({cartItems: this.props.cartItems})} />
                <SideMenu/>

                <div id='mainContainer' className={mainContainerClass} >
                    <TopBar/>
                    <div className='mainContainer-content' >
                        {routes}
                        {fetching}
                    </div>
                </div>
                <ReceiptPanel/>
            </div>
        </Router>

        return <div>
            {content}
        </div>
    }
}