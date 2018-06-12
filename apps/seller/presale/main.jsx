/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import SearchProduct from '../../sales/general/search/products/searchPanel.jsx'
import SearchClient from '../../sales/general/search/clients/searchPanel.jsx'
import Send from './send/sendPanel.jsx'
import ClientPanel from '../../../general/clientCreatePanel/clientCreatePanel.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'
import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Sale extends React.Component {

  componentWillMount() {
    this.props.dispatch(loadGlobalConfig('inventory', 'sales_warehouse', 'FETCH_SALES_WAREHOUSE_FULFILLED', 'FETCH_SALES_WAREHOUSE_REJECTED'))
    this.props.dispatch({type: 'PRESALE_PANEL_MOUNTED', payload: ''})

  }
  // *******************************************************************

  // Main Layout
  render() {

    return <div className='sale'>
      <Content />
      <Aside />

      <SearchProduct />
      <SearchClient />
      <Send />
      <ClientPanel />

    </div>

  }

}
