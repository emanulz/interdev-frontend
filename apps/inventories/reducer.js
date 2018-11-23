import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import layout from './layout/reducer.js'
import user from './user/reducer.js'
import products from './products/reducer.js'
import products2 from '../sales/general/product/reducer.js'
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

//fileTransfer reducers
import fileTransfer from '../inventories/fileTransfer/reducer.js'

//import products from '../sales/general/product/reducer.js'
import clients from './fileTransfer/clients/reducer.js'
import cart from '../sales/general/cart/reducer.js'
import presales from './presales/reducer.js'
import completed from '../sales/general/completed/reducer.js'
import config from '../sales/config/reducer.js'
import priceList from '../sales/general/priceList/reducer.js'
import currency from '../../general/currency/reducer.js'
import extras from '../sales/general/extras/reducer.js'
import warehouses2 from '../../general/warehouses/reducer.js'
import picker from '../inventories/fileTransferLoad/loadFromFile/reducer.js'
import transferDataLoad from '../inventories/fileTransferLoad/reducer.js'

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
  productSearch: search('productSearch'),
  transferSearch: search('filetransferSearch'),
  physicalTake,
  takeMovements,
  checkTakeMovements,
  userProfile,
  fileTransfer,
  cart, 
  clients,
  presales,
  completed,
  config,
  priceList,
  currency,
  extras,
  products2,
  warehouses2,
  picker, 
  transferDataLoad


})
