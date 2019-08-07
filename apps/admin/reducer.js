import { combineReducers } from 'redux'

import users from './users/reducer.js'
import taxpayer from './taxpayer/reducer.js'
import clientsAdmin from './clients/reducer.js'
import senders from './senders/reducer.js'
import productsAdmin from './products/reducer.js'
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
import presales from './presales/reducer.js'
import reprintInvoice from '../../general/reprintInvoice/reducer.js'
import generalReports from '../admin/reports/reducer.js'
import userProfile from '../../general/userProfile/reducer.js'
import epurchases from './invoicing/purchases/reducer.js'
import einvoices from './invoicing/invoices/reducer.js'
import etickets from './invoicing/tickets/reducer.js'
import ecreditNotes from './invoicing/creditNotes/reducer.js'
import edebitNotes from './invoicing/debitNotes/reducer.js'
import documentDetail from './invoicing/documentDetail/reducer.js'
import massiveRetry from './invoicing/massiveRetry/reducer.js'
import config from './config/reducer.js'
import currency from '../../general/currency/reducer.js'
import printPresale from '../../general/printPresale/reducer.js'
import registerclosures from './registerClosures/reducer.js'
import printRegisterClosure from '../../general/printRegisterClosure/reducer.js'
import salesclerks from './salesclerks/reducer.js'
import cashAdvances from './cashAdvances/reducer.js'
import creditVouchers from './vouchers/reducer.js'
import printCashAdvance from '../../general/printCashAdvance/reducer.js'
import printReturn from '../../general/printReturn/reducer.js'
import helpers from './helpers/reducer.js'
import projects from './projects/reducer.js'
import activities from './activities/reducer.js'
import selfpurchases from './invoicing/selfpurchases/reducer.js'

// SELF PURCHASE CART
import selfpurchase from './invoicing/selfpurchases/crud/create/reducer.js'
import cart from '../sales/general/cart/reducer.js'
import products from '../sales/general/product/reducer.js'
import clients from '../sales/general/clients/reducer.js'
import completed from '../sales/general/completed/reducer.js'
import priceList from '../sales/general/priceList/reducer.js'
import extras from '../sales/general/extras/reducer.js'
import generalItem from '../sales/general/product/generalItem/reducer.js'
import taxExemption from '../sales/sale/taxExemption/reducer.js'

export default combineReducers({
  users,
  taxpayer,
  clientsAdmin,
  senders,
  productsAdmin,
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
  clientProductSearch: search('clientProductSearch'),
  productClientCreate: search('productClientCreate'),
  clientSearch: search('clientSearch'),
  activitySearch: search('activitySearch'),
  productSearch: search('productSearch'),
  clientCategories,
  sales,
  presales,
  reprintInvoice,
  generalReports,
  userProfile,
  epurchases,
  einvoices,
  etickets,
  ecreditNotes,
  edebitNotes,
  selfpurchases,
  selfpurchase,
  config,
  currency,
  printPresale,
  registerclosures,
  printRegisterClosure,
  massiveRetry,
  salesclerks,
  cashAdvances,
  printCashAdvance,
  creditVouchers,
  printReturn,
  helpers,
  projects,
  activities,
  documentDetail,
  cart,
  products,
  clients,
  completed,
  priceList,
  extras,
  generalItem,
  taxExemption
})
