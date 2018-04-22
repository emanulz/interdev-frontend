/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs'

import General from './forms/general.jsx'
import Products from './forms/products.jsx'
import Clients from './forms/clients.jsx'
import Users from './forms/users.jsx'
import Sales from './forms/sales.jsx'
import Suppliers from './forms/suppliers.jsx'

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
          <Tab tabFor='one'>General</Tab>
          <Tab tabFor='two'>Productos</Tab>
          <Tab tabFor='three'>Clientes</Tab>
          <Tab tabFor='four'>Usuarios</Tab>
          <Tab tabFor='five'>Proveedores</Tab>
          <Tab tabFor='six'>Ventas</Tab>
        </TabList>

        <TabPanel tabId='one'>
          <General />
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

      </Tabs>

      : <div />

    return <div className='permissions-container-permissions'>
      {content}
    </div>

  }

}
