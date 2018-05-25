import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import layout from './layout/reducer.js'
import user from './user/reducer.js'
import clients from './clients/reducer.js'
import unpaidSales from './receivable/unpaidSales/reducer.js'
import saleMovements from './receivable/saleMovements/reducer.js'
import payments from './payments/reducer.js'
import invoice from './invoice/reducer.js'
import config from './config/reducer'

export default combineReducers({
  fetching,
  layout,
  user,
  clients,
  unpaidSales,
  saleMovements,
  payments,
  invoice,
  config
})
