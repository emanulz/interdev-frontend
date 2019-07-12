import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import user from './user/reducer.js'
import layout from './layout/reducer.js'
import messages from './messages/reducer.js'
import purchase from './purchase/reducer.js'
import purchase_products from './general/product/reducer.js'
import purchase_cart from './general/cart/reducer.js'
import purchase_clients from './general/clients/reducer.js'
import suppliers from './general/suppliers/reducer.js'
import pay from './purchase/pay/reducer.js'
import main from './main/reducer.js'
import warehouses from './general/warehouses/reducer.js'
import pagination from '../../general/pagination/reducer.js'
import search from '../../general/search/reducer.js'
import purchaseReceipt from './general/receipt/reducer.js'
import config from './general/config/reducer.js'
import reports from '../../general/reportsPanel/reducer.js'
import userProfile from '../../general/userProfile/reducer.js'
import smart_purchase from '../purchases/smart_purchase/reducer.js'
import smart_cart from '../purchases/smart_purchase/step_c/reducer.js'
import cross_ref from '../purchases/cross_ref_views/reducer.js'
// ORDERS
import order from './orders/reducer.js'
import cart from '../sales/general/cart/reducer.js'
import products from '../sales/general/product/reducer.js'
import clients from '../sales/general/clients/reducer.js'
import searchProducts from '../sales/general/search/products/reducer.js'
import currency from '../../general/currency/reducer.js'
import completed from '../sales/general/completed/reducer.js'
import priceList from '../sales/general/priceList/reducer.js'
import extras from '../sales/general/extras/reducer.js'
import generalItem from '../sales/general/product/generalItem/reducer.js'

// REQUESTS
import request from './requests/reducer.js'

export default combineReducers({
  main,
  fetching,
  user,
  layout,
  messages,
  purchase,
  purchase_cart,
  purchase_products,
  purchase_clients,
  suppliers,
  pay,
  warehouses,
  pagination,
  productSearch: search('productSearch'),
  supplierSearch: search('supplierSearch'),
  purchaseSearch: search('purchaseSearch'),
  requestSearch: search('requestSearch'),
  purchaseReceipt,
  config,
  reports,
  userProfile,
  smart_purchase,
  smart_cart,
  supplierLinker: search('supplierLinker'),
  productLinker: search('productLinker'),
  cross_ref,
  order,
  cart,
  products,
  clients,
  currency,
  completed,
  priceList,
  extras,
  generalItem,
  request

})
