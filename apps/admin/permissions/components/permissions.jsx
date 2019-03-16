/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs'

import Products from './forms/products.jsx'
import Clients from './forms/clients.jsx'
import Users from './forms/users.jsx'
import Suppliers from './forms/suppliers.jsx'
import Sales from './forms/sales.jsx'
import Presales from './forms/presales.jsx'
import Access from './forms/access.jsx'
import WorkOrder from './forms/workOrders.jsx'
import CashAdvances from './forms/cashAdvances.jsx'
import CreditVouchers from './forms/creditVouchers.jsx'
import CreditPayments from './forms/creditPayments.jsx'

@connect((store) => {
  return {
    user: store.users.userActive
  }
})
export default class Permissions extends React.Component {

  // Main Layout
  render() {

    const content = this.props.user.id != '0000000000'
      ? <Tabs vertical defaultTab='one'>
        <TabList vertical>
          <Tab tabFor='one'>Accesos</Tab>
          <Tab tabFor='two'>Productos</Tab>
          <Tab tabFor='three'>Clientes</Tab>
          <Tab tabFor='four'>Usuarios</Tab>
          <Tab tabFor='five'>Proveedores</Tab>
          <Tab tabFor='six'>Ventas</Tab>
          <Tab tabFor='seven'>Preventas</Tab>
          <Tab tabFor='eight'>Ordenes de Trabajo</Tab>
          <Tab tabFor='nine'>Adelantos de Efectivo</Tab>
          <Tab tabFor='ten'>Vales de Crédito</Tab>
          <Tab tabFor='eleven'>Pagos de Crédito</Tab>
        </TabList>

        <TabPanel tabId='one'>
          <Access />
        </TabPanel>

        <TabPanel tabId='two'>
          <Products />
        </TabPanel>

        <TabPanel tabId='three'>
          <Clients />
        </TabPanel>

        <TabPanel tabId='four'>
          <Users />
        </TabPanel>

        <TabPanel tabId='five'>
          <Suppliers />
        </TabPanel>

        <TabPanel tabId='six'>
          <Sales />
        </TabPanel>

        <TabPanel tabId='seven'>
          <Presales />
        </TabPanel>

        <TabPanel tabId='eight'>
          <WorkOrder />
        </TabPanel>

        <TabPanel tabId='nine'>
          <CashAdvances />
        </TabPanel>

        <TabPanel tabId='ten'>
          <CreditVouchers />
        </TabPanel>
        <TabPanel tabId='eleven'>
          <CreditPayments />
        </TabPanel>

      </Tabs>

      : <div />

    return <div className='permissions-container-permissions'>
      {content}
    </div>

  }

}
