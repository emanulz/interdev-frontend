import { combineReducers } from 'redux'

import users from './users/reducer.js'
import clients from './clients/reducer.js'
import senders from './senders/reducer.js'
import products from './products/reducer.js'
import productDepartments from './productDepartments/reducer.js'
import productSubDepartments from './productSubDepartments/reducer.js'
import suppliers from './suppliers/reducer.js'
import lockScreen from './lockScreen/reducer.js'
import user from './user/reducer.js'
import permissions from './permissions/reducer.js'
import fetching from '../../general/fetching/reducer.js'
import addresses from './addresses/reducer.js'
import warehouses from './warehouses/reducer.js'
import pagination from '../../general/pagination/reducer.js'
import productImporter from './products/prodImporter/reducer.js'

export default combineReducers({
  users,
  clients,
  senders,
  products,
  productDepartments,
  productSubDepartments,
  suppliers,
  lockScreen,
  user,
  fetching,
  permissions,
  addresses,
  warehouses,
  pagination
  productImporter
})
