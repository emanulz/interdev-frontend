import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import layout from './layout/reducer.js'
import user from './user/reducer.js'
import products from './products/reducer.js'
import movements from './movements/reducer.js'
import warehouses from './warehouses/reducer.js'
import sidePanel from './movements/sidePanel/reducer.js'
import inventoryMovements from './tracking/productMovements/reducer.js'
import pagination from '../../general/pagination/reducer.js'
import search from '../../general/search/reducer.js'
import physicalTake from './physicalTake/reducer.js'
import takeMovements from './takeMovements/reducer.js'
import checkTakeMovements from './checkTakeMovements/reducer.js'
import userProfile from '../../general/userProfile/reducer.js'

export default combineReducers({
  fetching,
  layout,
  user,
  products,
  movements,
  warehouses,
  sidePanel,
  inventoryMovements,
  pagination,
  inventorySearch: search('inventorySearch'),
  physicalTake,
  takeMovements,
  checkTakeMovements,
  userProfile
})
