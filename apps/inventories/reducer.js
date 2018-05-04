import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import user from './user/reducer.js'
import products from './products/reducer.js'
import sidePanel from './sidePanel/reducer.js'

export default combineReducers({
  fetching,
  user,
  products,
  sidePanel
})
