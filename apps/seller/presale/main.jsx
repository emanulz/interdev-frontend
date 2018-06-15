/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import Send from './send/sendPanel.jsx'
import ClientPanel from '../../../general/clientCreatePanel/clientCreatePanel.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'
import {connect} from 'react-redux'
import Search from '../../../general/search/search.jsx'

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

      <Search modelText='Producto' model='product' namespace='productSearch' />
      <Search modelText='Cliente' model='client' namespace='clientSearch' />
      <Send />
      <ClientPanel />

    </div>

  }

}
