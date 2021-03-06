import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import user from './user/reducer.js'
import layout from './layout/reducer.js'
import suppliers from '../../general/supplierProvider/reducer.js'
import payables from './payables/reducer.js'
import unpaidPurchases  from './payables/unpaidPurchases/reducer.js'
import purchaseMovements from './payables/purchaseMovements/reducer.js'
import payments from './payments/reducer.js'
import makePayment from  './payments/makePayment/reducer.js'
import messages from './messages/reducer.js'
import pagination from '../../general/pagination/reducer.js'
import userProfile from '../../general/userProfile/reducer.js'



export default combineReducers({
    user,
    fetching,
    layout,
    messages,
    suppliers,
    payables,
    unpaidPurchases,
    purchaseMovements,
    payments,
    makePayment,
    pagination,
    userProfile
})