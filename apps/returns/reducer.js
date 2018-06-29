import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import layout from './layout/reducer.js'
import user from './user/reducer.js'
import clients from './general/clients/reducer.js'
import products from './general/product/reducer.js'
import completed from './general/completed/reducer.js'
import messages from './messages/reducer.js'
import config from './config/reducer.js'
import moneyReturn from './moneyReturn/reducer.js'
import sale from './moneyReturn/content/sale/reducer.js'

export default combineReducers({
  fetching,
  layout,
  user,
  clients,
  products,
  messages,
  config,
  completed,
  moneyReturn,
  sale
})
