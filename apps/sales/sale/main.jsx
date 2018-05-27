/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import SearchProduct from '../general/search/products/searchPanel.jsx'
import SearchClient from '../general/search/clients/searchPanel.jsx'
import PayPanel from './pay/payPanel.jsx'
import InvoicePanel from '../general/invoice/invoicePanel/invoicePanel.jsx'
import { socketDispatcher } from './socketDispatcher.js'

import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Sale extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'SALE_PANEL_MOUNTED', payload: ''})

    const chatSocket = new WebSocket(
      'ws://' + window.location.host + '/ws/global_broadcaster/')
    const _this = this
    chatSocket.onmessage = function(e) {
      const data = JSON.parse(e.data)
      const message = data['message']
      socketDispatcher(message, _this.props.dispatch)
    }

  }
  // *******************************************************************

  // Main Layout
  render() {

    return <div className='sale'>
      <Content />
      <Aside />

      <SearchProduct />
      <SearchClient />
      <PayPanel />
      <InvoicePanel />

    </div>

  }

}
