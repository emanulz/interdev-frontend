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
import clientCreatePanel from './../../general/clientCreatePanel/reducer.js'
import completed from '../sales/general/completed/reducer.js'
import printPresale from '../../general/printPresale/reducer.js'
import extras from '../sales/general/extras/reducer.js'
import searchRestaurant from './presale/search/reducer.js'
import userProfile from '../../general/userProfile/reducer.js'
import tables from './tables/reducer.js'
import tableBills from './tableBills/reducer.js'
import newBill from './tableBills/newBill/reducer.js'
import actions from './actionList/reducer.js'

export default combineReducers({
  fetching,
  layout,
  user,
  cart,
  clients,
  products,
  presale,
  messages,
  send,
  sales,
  config,
  clientCreatePanel,
  completed,
  printPresale,
  extras,
  searchRestaurant,
  userProfile,
  tables,
  tableBills,
  newBill,
  actions
})
