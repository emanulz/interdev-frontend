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
import invoice from './general/invoice/reducer.js'
import sales from './general/sales/reducer.js'
import preturn from './return/reducer.js'
import config from './config/reducer.js'
import presales from './sale/presales/reducer.js'
import clientCreatePanel from './../../general/clientCreatePanel/reducer.js'

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
  invoice,
  sales,
  config,
  presales,
  clientCreatePanel,
  preturn
})
