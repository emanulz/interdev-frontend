import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import layout from './layout/reducer.js'
import user from './user/reducer.js'
import clients from './clients/reducer.js'
import statement from './receivable/statement/reducer.js'

export default combineReducers({
  fetching,
  layout,
  user,
  clients,
  statement
})
