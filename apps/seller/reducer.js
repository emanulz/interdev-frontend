import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import layout from './layout/reducer.js'
import user from './user/reducer.js'
import cart from './general/cart/reducer.js'
import clients from './general/clients/reducer.js'
import products from './general/product/reducer.js'
import presale from './presale/reducer.js'
import messages from './messages/reducer.js'
import searchClients from './general/search/clients/reducer.js'
import searchProducts from './general/search/products/reducer.js'
import send from './presale/send/reducer.js'
import invoice from './general/invoice/reducer.js'
import sales from './general/sales/reducer.js'
import config from './config/reducer.js'

export default combineReducers({
  fetching,
  layout,
  user,
  cart,
  clients,
  products,
  presale,
  messages,
  searchClients,
  searchProducts,
  send,
  invoice,
  sales,
  config
})
