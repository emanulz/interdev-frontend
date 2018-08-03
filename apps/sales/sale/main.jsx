/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import PayPanel from './pay/payPanel.jsx'
import InvoicePanel from '../general/invoice/invoicePanel/invoicePanel.jsx'
import ClientPanel from '../../../general/clientCreatePanel/clientCreatePanel.jsx'
import Presales from './presales/presalesList.jsx'
import WorkOrders from './workOrders/workOrdersList.jsx'
import TodaySales from './todaySales/todaySales.jsx'
import TaxExemptionPanel from './taxExemption/taxExemption.jsx'
import ReprintInvoice from '../../../general/reprintInvoice/reprintInvoicePanel/reprintInvoicePanel.jsx'
import Search from '../../../general/search/search.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'
import { socketDispatcher } from './socketDispatcher.js'
import {productSearchDoubleClick, clientSearchDoubleClick} from '../general/search/actions.js'

import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Sale extends React.Component {

  componentWillMount() {

    this.props.dispatch(loadGlobalConfig('inventory', 'sales_warehouse', 'FETCH_SALES_WAREHOUSE_FULFILLED', 'FETCH_SALES_WAREHOUSE_REJECTED'))
    this.props.dispatch(loadGlobalConfig('inventory', 'workshop_warehouse', 'FETCH_WORKSHOP_WAREHOUSE_FULFILLED', 'FETCH_WORKSHOP_WAREHOUSE_REJECTED'))
    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))

    this.props.dispatch({type: 'SALE_PANEL_MOUNTED', payload: ''})

    const chatSocket = new WebSocket(
      'ws://' + window.location.host + '/ws/global_broadcaster/')
    const _this = this
    chatSocket.onmessage = function(e) {
      const data = JSON.parse(e.data)
      const message = data['message']
      const item = data['item']
      socketDispatcher(message, item, _this.props.dispatch)
    }

  }
  // *******************************************************************
  // Main Layout
  render() {

    return <div className='sale'>
      <Content />
      <Aside />

      <Search modelText='Producto' model='product' namespace='productSearch' onRowDoubleClick={productSearchDoubleClick} />
      <Search modelText='Cliente' model='client' namespace='clientSearch' onRowDoubleClick={clientSearchDoubleClick} />
      <PayPanel />
      <InvoicePanel />
      <Presales />
      <ClientPanel />
      <WorkOrders />
      <TodaySales />
      <TaxExemptionPanel />
      <ReprintInvoice />

    </div>

  }

}
