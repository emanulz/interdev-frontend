import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import layout from './layout/reducer.js'
import user from './user/reducer.js'
import clients from './clients/reducer.js'
import unpaidSales from './receivable/unpaidSales/reducer.js'
import clientCreditPayments from './receivable/paymentList/reducer.js'
import saleMovements from './receivable/saleMovements/reducer.js'
import payments from './payments/reducer.js'
import invoice from './invoice/reducer.js'
import config from './config/reducer'
import pagination from '../../general/pagination/reducer.js'
import search from '../../general/search/reducer.js'
import userProfile from '../../general/userProfile/reducer.js'

export default combineReducers({
  fetching,
  layout,
  user,
  clients,
  unpaidSales,
  saleMovements,
  payments,
  invoice,
  config,
  pagination,
  clientCreditPayments,
  receivableSearch: search('receivableSearch'),
  userProfile,
  paymentsSearch: search('paymentsSearch')
})
