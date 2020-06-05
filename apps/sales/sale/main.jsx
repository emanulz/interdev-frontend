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
import SaveReserve from './reserves/saveReserve.jsx'
import NSReserves from './nsreserves/nsreservesList.jsx'
import Quotations from './quotations/quotationsList.jsx'
import Reinvoices from './reinvoices/reinvoicesList.jsx'
import RestaurantBills from './restaurantBills/restaurantBillsList.jsx'
import WorkOrders from './workOrders/workOrdersList.jsx'
import TodaySales from './todaySales/todaySales.jsx'
import TaxExemptionPanel from './taxExemption/taxExemption.jsx'
import ReferenceDocs from './referenceDocs/referenceDocs.jsx'
import CashAdvancePanel from './cashAdvance/cashAdvance.jsx'
import ReprintInvoice from '../../../general/reprintInvoice/reprintInvoicePanel/reprintInvoicePanel.jsx'
import PrintCashAdvance from '../../../general/printCashAdvance/printCashAdvancePanel/printCashAdvancePanel.jsx'
import PrintPresale from '../../../general/printPresale/printPresalePanel/printPresalePanel.jsx'
import Search from '../../../general/search/search.jsx'
import RegisterClosure from '../registerClosure/registerClosure.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'
import { socketDispatcher } from './socketDispatcher.js'
import {productSearchDoubleClick, clientSearchDoubleClick, productSearchClick, productSearchActive, productSetAction} from '../general/search/actions.js'
import {loadPresaleItem} from './presales/actions.js'
import ConfigLoader from '../../../general/configLoader/configLoader.jsx'

import {connect} from 'react-redux'
const uuidv1 = require('uuid/v1')
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    conf: store.config.globalConf,
    activePresaleId: store.presales.activePresaleId
  }
})
export default class Sale extends React.Component {

  componentWillMount() {

    // this.props.dispatch(loadGlobalConfig('inventory', 'sales_warehouse', 'FETCH_SALES_WAREHOUSE_FULFILLED', 'FETCH_SALES_WAREHOUSE_REJECTED'))
    this.props.dispatch(loadGlobalConfig('inventory', 'workshop_warehouse', 'FETCH_WORKSHOP_WAREHOUSE_FULFILLED', 'FETCH_WORKSHOP_WAREHOUSE_REJECTED'))
    // this.props.dispatch(loadGlobalConfig('inventory', 'reserves_warehouse', 'FETCH_RESERVES_WAREHOUSE_FULFILLED', 'FETCH_RESERVES_WAREHOUSE_REJECTED'))
    // this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
    // this.props.dispatch(loadGlobalConfig('installed_apps', false, 'FETCH_INSTALLED_APPS_FULFILLED', 'FETCH_INSTALLED_APPS_REJECTED'))
    // this.props.dispatch(loadGlobalConfig('receipt_styles', false, 'FETCH_RECEIPT_STYLES_FULFILLED', 'FETCH_RECEIPT_STYLES_REJECTED'))

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.conf != this.props.conf) {
      if (nextProps.conf.openPresalesPanelDefault) {

        const _this = this
        Mousetrap.bind('esc', function() {
          _this.props.dispatch({type: 'HIDE_PRESALES_PANEL', payload: -1})
          document.getElementById('productCodeInputField').focus()
          document.getElementById('productCodeInputField').value = ''
          Mousetrap.unbind('esc')
          Mousetrap.unbind('up')
          Mousetrap.unbind('down')
          Mousetrap.unbind('enter')
        })
        Mousetrap.bind('enter', function(e) {
          loadPresaleItem(_this.props.activePresaleId, _this.props.dispatch)
          Mousetrap.unbind('enter')
        })
        Mousetrap.bind('down', function(e) {
          _this.props.dispatch({type: 'PRESALES_INCREASE_ACTIVE_INDEX', payload: -1})
        })
        Mousetrap.bind('up', function(e) {
          _this.props.dispatch({type: 'PRESALES_DECREASE_ACTIVE_INDEX', payload: -1})
        })
        this.props.dispatch({type: 'SHOW_PRESALES_PANEL', payload: -1})

      }
    }
  }
  // *******************************************************************
  // Main Layout
  render() {

    const productModel = this.props.conf.mobileSales ? 'productCompact' : 'product'

    return <div className='sale'>
      <ConfigLoader sectionName='global_conf' successDispatch='FETCH_GLOBAL_CONF_FULFILLED' failDispatch='FETCH_GLOBAL_CONF_REJECTED' />
      <ConfigLoader sectionName='installed_apps' successDispatch='FETCH_INSTALLED_APPS_FULFILLED' failDispatch='FETCH_INSTALLED_APPS_REJECTED' />
      <ConfigLoader sectionName='receipt_styles' successDispatch='FETCH_RECEIPT_STYLES_FULFILLED' failDispatch='FETCH_RECEIPT_STYLES_REJECTED' />

      <RegisterClosure />
      <Currency />
      <Content />
      <Aside />
      <Search modelText='Producto' model={productModel} namespace='productSearch' onRowDoubleClick={productSearchDoubleClick}
        onRowClick={productSearchClick} onActiveItem={productSearchActive} sortedBy='code' useImage setAction={productSetAction}
        usePerLocalProds={this.props.conf.usePerLocalProds} />
      <Search modelText='Cliente' model='client' namespace='clientSearch' onRowDoubleClick={clientSearchDoubleClick} />
      <PayPanel />
      <Presales />
      <Reserves />
      <SaveReserve />
      <NSReserves />
      <Quotations />
      <Reinvoices />
      <ClientPanel />
      <ClientUpdatePanel />
      <WorkOrders />
      <TodaySales />
      <RestaurantBills />
      <TaxExemptionPanel />
      <ReferenceDocs />
      <CashAdvancePanel />
      <ReprintInvoice />
      <PrintCashAdvance />
      <PrintPresale />

    </div>

  }

}
