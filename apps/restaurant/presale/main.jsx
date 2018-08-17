/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import Send from './send/sendPanel.jsx'
import PrintPresale from '../../../general/printPresale/printPresalePanel/printPresalePanel.jsx'
import {loadGlobalConfig, getItemDispatch} from '../../../utils/api.js'
import {connect} from 'react-redux'
import Search from './search/search.jsx'
import {productSearchDoubleClick, clientSearchDoubleClick, productSearchClick, productSearchActive} from '../../sales/general/search/actions.js'
import {loadPresale} from './actions.js'
import {getFullClientById} from '../../sales/general/clients/actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
  }
})
export default class Sale extends React.Component {

  componentWillMount() {
    this.props.dispatch(loadGlobalConfig('inventory', 'sales_warehouse', 'FETCH_SALES_WAREHOUSE_FULFILLED', 'FETCH_SALES_WAREHOUSE_REJECTED'))
    this.props.dispatch(loadGlobalConfig('inventory', 'reserves_warehouse', 'FETCH_RESERVES_WAREHOUSE_FULFILLED', 'FETCH_RESERVES_WAREHOUSE_REJECTED'))
    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_USE_RESERVES_REJECTED'))
    this.props.dispatch({type: 'PRESALE_PANEL_MOUNTED', payload: ''})
    const productsKwargs = {
      url: '/api/productsrestaurant/?limit=200',
      successType: 'SEARCH_RESTAURANT_FETCH_PRODUCTS',
      errorType: 'SEARCH_RESTAURANT_FETCH_ERROR'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productsKwargs))

    const productsDepartmentsKwargs = {
      url: '/api/productdepartments/?limit=100',
      successType: 'SEARCH_RESTAURANT_FETCH_DEPARTMENTS',
      errorType: 'SEARCH_RESTAURANT_FETCH_ERROR'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productsDepartmentsKwargs))
    const lookUp = this.props.location.pathname.split('/').pop()
    if (lookUp) { this.loadPresaleItem(lookUp) }
  }

  loadPresaleItem(id) {

    const _this = this
    const url = `/api/presales/${id}`
    const loadPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(loadPresale(url, resolve, reject))
    })
    loadPromise.then((data) => {
      console.log(data)
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      data.cart = JSON.parse(data.cart)
      data.client = JSON.parse(data.client)
      data.user = JSON.parse(data.user)
      try {
        data.extras = JSON.parse(data.extras)
      } catch (err) { data.extras = null }
      // _this.props.dispatch({type: 'CLIENT_SELECTED', payload: data.client})
      getFullClientById(data.client.id, _this.props.dispatch)
      _this.props.dispatch({type: 'LOAD_CART', payload: data.cart})
      _this.props.dispatch({type: 'SET_PRESALE_USER', payload: data.user})
      _this.props.dispatch({type: 'SET_PRESALE_EXTRAS', payload: data.extras})
    }).catch((err) => {
      if (err.response) {
        alertify.alert('ERROR', `${err.response.data}`)
      } else {
        alertify.alert('ERROR', `Hubo un error al cargar la preventa, error: ${err}`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }
  // *******************************************************************

  // Main Layout
  render() {

    return <div className='sale'>
      <Content />
      <Aside />

      {/* <Search modelText='Producto' model='product' namespace='productSearch' onRowDoubleClick={productSearchDoubleClick}
        onRowClick={productSearchClick} onActiveItem={productSearchActive} sortedBy='code' useImage /> */}
      {/* <Search modelText='Cliente' model='client' namespace='clientSearch' onRowDoubleClick={clientSearchDoubleClick} /> */}
      <Search onRowDoubleClick={productSearchDoubleClick} />
      <Send />
      {/* <ClientPanel /> */}
      <PrintPresale />

    </div>

  }

}
