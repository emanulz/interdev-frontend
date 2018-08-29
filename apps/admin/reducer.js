import { combineReducers } from 'redux'

import users from './users/reducer.js'
import taxpayer from './taxpayer/reducer.js'
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
import Importer from './products/importer/reducer.js'
import search from '../../general/search/reducer.js'
import clientCategories from './clientCategories/reducer.js'
import sales from './sales/reducer.js'
import reprintInvoice from '../../general/reprintInvoice/reducer.js'
import generalReports from '../admin/reports/reducer.js'
import userProfile from '../../general/userProfile/reducer.js'
import epurchases from './invoicing/purchases/reducer.js'
import einvoices from './invoicing/invoices/reducer.js'

export default combineReducers({
  users,
  taxpayer,
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
  pagination,
  Importer,
  adminSearch: search('adminSearch'),
  clientCategories,
  sales,
  reprintInvoice,
  generalReports,
  userProfile,
  epurchases,
  einvoices
})
