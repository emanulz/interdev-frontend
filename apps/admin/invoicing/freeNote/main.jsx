/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import Currency from '../../../../general/currency/currency.jsx'
import Search from '../../../../general/search/search.jsx'
// import {loadGlobalConfig} from '../../../../utils/api.js'
import {productSearchDoubleClick, productSearchClick, productSearchActive, productSetAction} from '../../../sales/general/search/actions.js'
import SingleProduct from '../../../sales/general/product/singleProduct.jsx'
import GeneralItem from '../../../sales/general/product/generalItem/generalItem.jsx'
// import TaxExemptionPanel from '../../sales/sale/taxExemption/taxExemption.jsx'
// import Send from './send/sendPanel.jsx'

import {connect} from 'react-redux'
const uuidv1 = require('uuid/v1')

@connect((store) => {
  return {
    conf: store.config.globalConf
  }
})
export default class SelfPurchase extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_CART'})
    this.props.dispatch({type: 'FRRENOTE_PANEL_MOUNTED', payload: ''})

    const uuid = uuidv1()
    this.props.dispatch({type: 'SET_FREENOTE_UUID', payload: uuid})

  }

  // *******************************************************************
  // Main Layout
  render() {

    return <div className='sale'>

      <Currency />
      <Content />
      <Aside />
      <Search modelText='Producto' model='product' namespace='productSearch' onRowDoubleClick={productSearchDoubleClick}
        onRowClick={productSearchClick} onActiveItem={productSearchActive} sortedBy='code' useImage setAction={productSetAction} />
      <SingleProduct />
      <GeneralItem />
    </div>

  }

}
