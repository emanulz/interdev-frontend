/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import PayPanel from './pay/payPanel.jsx'
import ClientPanel from '../../../general/clientCreatePanel/clientCreatePanel.jsx'
import Currency from '../../../general/currency/currency.jsx'
import ClientUpdatePanel from '../../../general/clientUpdatePanel/clientUpdatePanel.jsx'
import Presales from './presales/presalesList.jsx'
import Reserves from './reserves/reservesList.jsx'
import NSReserves from './nsreserves/nsreservesList.jsx'
import Quotations from './quotations/quotationsList.jsx'
import RestaurantBills from './restaurantBills/restaurantBillsList.jsx'
import WorkOrders from './workOrders/workOrdersList.jsx'
import TodaySales from './todaySales/todaySales.jsx'
import TaxExemptionPanel from './taxExemption/taxExemption.jsx'
import CashAdvancePanel from './cashAdvance/cashAdvance.jsx'
import ReprintInvoice from '../../../general/reprintInvoice/reprintInvoicePanel/reprintInvoicePanel.jsx'
import PrintCashAdvance from '../../../general/printCashAdvance/printCashAdvancePanel/printCashAdvancePanel.jsx'
import PrintPresale from '../../../general/printPresale/printPresalePanel/printPresalePanel.jsx'
import Search from '../../../general/search/search.jsx'
import RegisterClosure from '../registerClosure/registerClosure.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'
import { socketDispatcher } from './socketDispatcher.js'
import {productSearchDoubleClick, clientSearchDoubleClick, productSearchClick, productSearchActive, productSetAction} from '../general/search/actions.js'

import {connect} from 'react-redux'
const uuidv1 = require('uuid/v1')

@connect((store) => {
  return {
  }
})
export default class Sale extends React.Component {

  componentWillMount() {

    // this.props.dispatch(loadGlobalConfig('inventory', 'sales_warehouse', 'FETCH_SALES_WAREHOUSE_FULFILLED', 'FETCH_SALES_WAREHOUSE_REJECTED'))
    this.props.dispatch(loadGlobalConfig('inventory', 'workshop_warehouse', 'FETCH_WORKSHOP_WAREHOUSE_FULFILLED', 'FETCH_WORKSHOP_WAREHOUSE_REJECTED'))
    // this.props.dispatch(loadGlobalConfig('inventory', 'reserves_warehouse', 'FETCH_RESERVES_WAREHOUSE_FULFILLED', 'FETCH_RESERVES_WAREHOUSE_REJECTED'))
    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
    this.props.dispatch(loadGlobalConfig('installed_apps', false, 'FETCH_INSTALLED_APPS_FULFILLED', 'FETCH_INSTALLED_APPS_REJECTED'))
    this.props.dispatch(loadGlobalConfig('receipt_styles', false, 'FETCH_RECEIPT_STYLES_FULFILLED', 'FETCH_RECEIPT_STYLES_REJECTED'))

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

    const uuid = uuidv1()
    this.props.dispatch({type: 'SET_SALE_UUID', payload: uuid})

  }
  // *******************************************************************
  // Main Layout
  render() {

    return <div className='sale'>
      <RegisterClosure />
      <Currency />
      <Content />
      <Aside />
      <Search modelText='Producto' model='product' namespace='productSearch' onRowDoubleClick={productSearchDoubleClick}
        onRowClick={productSearchClick} onActiveItem={productSearchActive} sortedBy='code' useImage setAction={productSetAction} />
      <Search modelText='Cliente' model='client' namespace='clientSearch' onRowDoubleClick={clientSearchDoubleClick} />
      <PayPanel />
      <Presales />
      <Reserves />
      <NSReserves />
      <Quotations />
      <ClientPanel />
      <ClientUpdatePanel />
      <WorkOrders />
      <TodaySales />
      <RestaurantBills />
      <TaxExemptionPanel />
      <CashAdvancePanel />
      <ReprintInvoice />
      <PrintCashAdvance />
      <PrintPresale />

    </div>

  }

}
