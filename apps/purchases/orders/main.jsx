/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import Currency from '../../../general/currency/currency.jsx'
import Search from '../../../general/search/search.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'
import {productSearchDoubleClick, productSearchClick, productSearchActive, productSetAction} from '../../sales/general/search/actions.js'
import SingleProduct from '../../sales/general/product/singleProduct.jsx'
import GeneralItem from '../../sales/general/product/generalItem/generalItem.jsx'

import {connect} from 'react-redux'
const uuidv1 = require('uuid/v1')

@connect((store) => {
  return {
    conf: store.config.globalConf
  }
})
export default class Order extends React.Component {

  componentWillMount() {

    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
    this.props.dispatch(loadGlobalConfig('installed_apps', false, 'FETCH_INSTALLED_APPS_FULFILLED', 'FETCH_INSTALLED_APPS_REJECTED'))
    this.props.dispatch(loadGlobalConfig('receipt_styles', false, 'FETCH_RECEIPT_STYLES_FULFILLED', 'FETCH_RECEIPT_STYLES_REJECTED'))
    this.props.dispatch({type: 'CLEAR_CART'})
    this.props.dispatch({type: 'ORDER_PANEL_MOUNTED', payload: ''})

    const uuid = uuidv1()
    this.props.dispatch({type: 'SET_ORDER_UUID', payload: uuid})

  }

  // *******************************************************************
  // Main Layout
  render() {

    return <div className='sale'>

      <Currency />
      <Content />
      <Content />
      <Aside />
      <Search modelText='Producto' model='product' namespace='productSearch' onRowDoubleClick={productSearchDoubleClick}
        onRowClick={productSearchClick} onActiveItem={productSearchActive} sortedBy='code' useImage setAction={productSetAction} />
      <SingleProduct />
      <GeneralItem />
    </div>

  }

}
