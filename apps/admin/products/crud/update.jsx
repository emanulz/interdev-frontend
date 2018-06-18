/*
 * Module dependencies
 */
import React from 'react'
import Form from './form/form.jsx'
import Form2 from './form/form2.jsx'
import Form3 from './form/form3.jsx'

import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import {setNextPrevItem} from '../../../../utils/api'
import {Link} from 'react-router-dom'
import UpdateButtons from './form/updateButtons.jsx'
import ItemsBar from '../../layout/itemsBar/itemsBar.jsx'
import {toggleItemsBar} from '../../layout/itemsBar/actions'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs'

@connect((store) => {
  return {
    permissions: store.products.permissions,
    product: store.products.productActive,
    nextProduct: store.products.nextProduct,
    previousProduct: store.products.previousProduct,
    products: store.products.products
  }
})
export default class Update extends React.Component {

  componentDidMount() {
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_PRODUCT', payload: ''})
  }

  componentWillUpdate(nextProps) {

    const code = this.props.location.pathname.split('/').pop()

    if (nextProps.nextProduct == 0 && nextProps.previousProduct == 0 && nextProps.products.length) {

      const kwargs = {
        items: [
          ...nextProps.products
        ],
        codeField: 'code',
        code: code,
        dispatchType: 'SET_NEXT_PREV_PRODUCT'
      }

      this.props.dispatch(setNextPrevItem(kwargs))

    }
  }

  toggleBar() {
    toggleItemsBar()
  }

  // Main Layout
  render() {

    let content = ''

    const code = this.props.location.pathname.split('/').pop()

    switch (this.props.permissions.change) {
      case true:
      {
        content = <div>
          <Tabs>
            <TabList>
              <Tab className='oneThree' tabFor='one'>General</Tab>
              <Tab className='oneThree' tabFor='two'>Precios</Tab>
              <Tab className='oneThree' tabFor='three'>Extras</Tab>
            </TabList>

            <TabPanel tabId='one'>
              <Form key={`${code}1`} update />
            </TabPanel>

            <TabPanel tabId='two'>
              <Form2 key={`${code}2`} update />
            </TabPanel>

            <TabPanel tabId='three'>
              <Form3 key={`${code}3`} update />
            </TabPanel>

            <TabPanel tabId='four' />

          </Tabs>
          <UpdateButtons />
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
        <h1>EDITAR PRODUCTO</h1>
        <Link to={`/admin/products/edit/${this.props.previousProduct}`}>
          <span className={`previous fa fa-chevron-circle-left`} />
        </Link>
        <Link to={`/admin/products/edit/${this.props.nextProduct}`}>
          <span className='next fa fa-chevron-circle-right' />
        </Link>
        <span onClick={this.toggleBar.bind(this)} className='list fa fa-list' />
      </div>

      {content}

      <ItemsBar items={this.props.products} tittle='Lista Productos' codeField='code' descriptionField='description'
        descriptionField2={false} editPath='/admin/products/edit/' />
    </div>

  }

}
