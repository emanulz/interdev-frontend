/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import {fecthProfile, fecthIsAdminLocked} from './actions'
import ReprintInvoice from '../../../general/reprintInvoice/reprintInvoicePanel/reprintInvoicePanel.jsx'
import PrintPresale from '../../../general/printPresale/printPresalePanel/printPresalePanel.jsx'
import PrintRegisterClosure from '../../../general/printRegisterClosure/printRegisterClosurePanel/printRegisterClosurePanel.jsx'
import UserProfile from '../../../general/userProfile/userProfile.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'
import Currency from '../../../general/currency/currency.jsx'

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
    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
    this.props.dispatch(loadGlobalConfig('receipt_styles', false, 'FETCH_RECEIPT_STYLES_FULFILLED', 'FETCH_RECEIPT_STYLES_REJECTED'))
  }

  // Main Layout
  render() {

    const fetching = this.props.fetching ? <Fetching /> : ''

    const unlocked = <Router>
      <div>
        <UserProfile />
        <SideMenu />
        <Currency />
        <div id='mainContainer' className='blur-div mainContainer'>
          <TopBar />
          <Configbar />
          <div onClick={hideConfigBar} className='mainContainer-content'>
            {routes}
            {fetching}
          </div>
        </div>
        <ReprintInvoice />
        <PrintPresale />
        <PrintRegisterClosure />
      </div>
    </Router>

    const locked = <LockScreen />

    const content = this.props.adminLocked ? locked : unlocked

    return <div>
      {content}
    </div>
  }

}
