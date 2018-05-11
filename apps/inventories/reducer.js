import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import layout from './layout/reducer.js'
import user from './user/reducer.js'
import products from './products/reducer.js'
import movements from './movements/reducer.js'
import warehouses from './warehouses/reducer.js'

export default combineReducers({
  fetching,
  layout,
  user,
  products,
  movements,
  warehouses
})
