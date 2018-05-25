import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import user from './user/reducer.js'
import layout from './layout/reducer.js'
import messages from './messages/reducer.js'
import purchase from './purchase/reducer.js'
import products from './general/product/reducer.js'
import cart from './general/cart/reducer.js'
import clients from './general/clients/reducer.js'
import suppliers from './general/suppliers/reducer.js'
import pay from './purchase/pay/reducer.js'
import main from './main/reducer.js'


export default combineReducers({
    main,
    fetching,
    user,
    layout,
    messages,
    purchase,
    cart,
    products,
    clients,
    suppliers,
    pay
})