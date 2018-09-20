import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import layout from './layout/reducer.js'
import user from './user/reducer.js'
import cart from './general/cart/reducer.js'
import clients from './general/clients/reducer.js'
import products from './general/product/reducer.js'
import sale from './sale/reducer.js'
import messages from './messages/reducer.js'
import searchClients from './general/search/clients/reducer.js'
import searchProducts from './general/search/products/reducer.js'
import pay from './sale/pay/reducer.js'
import sales from './general/sales/reducer.js'
import extras from './general/extras/reducer.js'
import config from './config/reducer.js'
import presales from './sale/presales/reducer.js'
import reserves from './sale/reserves/reducer.js'
import quotations from './sale/quotations/reducer.js'
import restaurantBills from './sale/restaurantBills/reducer.js'
import workOrders from './sale/workOrders/reducer.js'
import clientCreatePanel from './../../general/clientCreatePanel/reducer.js'
import search from '../../general/search/reducer.js'
import completed from './general/completed/reducer.js'
import todaySales from './sale/todaySales/reducer.js'
import taxExemption from './sale/taxExemption/reducer.js'
import cashAdvance from './sale/cashAdvance/reducer.js'
import reprintInvoice from '../../general/reprintInvoice/reducer.js'
import printCashAdvance from '../../general/printCashAdvance/reducer.js'
import userProfile from '../../general/userProfile/reducer.js'
import generalItem from './general/product/generalItem/reducer.js'
import printPresale from '../../general/printPresale/reducer.js'
import clientUpdatePanel from '../../general/clientUpdatePanel/reducer.js'

export default combineReducers({
  fetching,
  layout,
  user,
  cart,
  clients,
  products,
  sale,
  messages,
  searchClients,
  searchProducts,
  pay,
  sales,
  config,
  presales,
  clientCreatePanel,
  productSearch: search('productSearch'),
  clientSearch: search('clientSearch'),
  completed,
  workOrders,
  todaySales,
  taxExemption,
  cashAdvance,
  reprintInvoice,
  reserves,
  restaurantBills,
  printCashAdvance,
  extras,
  userProfile,
  generalItem,
  printPresale,
  quotations,
  clientUpdatePanel
})
