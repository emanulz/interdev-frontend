/*
 * Module dependencies
 */
import React from 'react'
import Form from './form/form.jsx'
import Form2 from './form/form2.jsx'
import Form3 from './form/form3.jsx'

import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import CreateButtons from './form/createButtons.jsx'
import ItemsBar from '../../layout/itemsBar/itemsBar.jsx'
import {toggleItemsBar} from '../../layout/itemsBar/actions'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs'

@connect((store) => {
  return {
    permissions: store.products.permissions,
    products: store.products.products
  }
})
export default class Update extends React.Component {

  toggleBar() {
    toggleItemsBar()
  }

  // Main Layout
  render() {

    let content = ''

    switch (this.props.permissions.add) {
      case true:
      {
        content = <div>
          <Tabs defaultTab='one'>
            <TabList>
              <Tab className='oneThree' tabFor='one'>General</Tab>
              <Tab className='oneThree' tabFor='two'>Precios</Tab>
              <Tab className='oneThree' tabFor='three'>Extras</Tab>
            </TabList>

            <TabPanel tabId='one'>
              <Form />
            </TabPanel>

            <TabPanel tabId='two'>
              <Form2 />
            </TabPanel>

            <TabPanel tabId='three'>
              <Form3 />
            </TabPanel>

          </Tabs>
          <CreateButtons />
        </div>
        break
      } // case

      case false:
      {
        content = <Unauthorized />
        break
      } // case
      default:
      {
        content = <div />
        break
      } // case
    }

    return <div className='create heigh100'>
      <div className='create-edit-header'>
        <h1>CREAR PRODUCTO</h1>
        <span onClick={this.toggleBar.bind(this)} className='list fa fa-list' />
      </div>
      {content}

      <ItemsBar items={this.props.products} tittle='Lista Productos' codeField='code'
        descriptionField='description' descriptionField2={false} editPath='/admin/products/edit/' />
    </div>

  }

}
