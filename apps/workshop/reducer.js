import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import user from './user/reducer.js'
import layout from './layout/reducer.js'
import workorder from './workorder/reducer.js'
import clients from './general/clients/reducer.js'
import clientCreatePanel from '../../general/clientCreatePanel/reducer.js'
import messages from './messages/reducer.js'
import workshopview from './workshopView/reducer.js'
import partsProvider from './workshopView/partsProvider/reducer.js'
import transactionsList from './workshopView/transactionsList/reducer.js'
import workshopReceipt from './general/receipt/reducer.js'
import config from './config/reducer.js'
import searchClients from './general/search/clients/reducer.js'
import searchProducts from './general/search/products/reducer.js'
import search from '../../general/search/reducer.js'


export default combineReducers({
    fetching,
    user,
    layout,
    searchClients,
    workorder,
    clients,
    clientCreatePanel,
    messages,
    workshopview,
    partsProvider,
    searchProducts,
    transactionsList,
    workshopReceipt,
    config,
    clientSearch: search('clientSearch'),

})