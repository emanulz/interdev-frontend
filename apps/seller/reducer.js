import { combineReducers } from 'redux'

import layout from './layout/reducer.js'
import presale from './presale/reducer.js'
import send from './presale/send/reducer.js'
import sales from './general/sales/reducer.js'

import config from '../sales/config/reducer.js'
import fetching from '../../general/fetching/reducer.js'
import user from '../sales/user/reducer.js'
import cart from '../sales/general/cart/reducer.js'
import clients from '../sales/general/clients/reducer.js'
import products from '../sales/general/product/reducer.js'
import messages from '../sales/messages/reducer.js'
import searchClients from '../sales/general/search/clients/reducer.js'
import searchProducts from '../sales/general/search/products/reducer.js'
import clientCreatePanel from './../../general/clientCreatePanel/reducer.js'
import search from '../../general/search/reducer.js'

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
  sales,
  config,
  clientCreatePanel,
  productSearch: search('productSearch'),
  clientSearch: search('clientSearch')
})