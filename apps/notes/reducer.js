import { combineReducers } from 'redux'
import layout from './layout/reducer.js'

import config from '../sales/config/reducer.js'
import fetching from '../../general/fetching/reducer.js'
import presales from './presales/reducer.js'
import user from '../sales/user/reducer.js'
import userProfile from '../../general/userProfile/reducer.js'
import generalItem from '../sales/general/product/generalItem/reducer.js'
import products from '../sales/general/product/reducer.js'
import clients from '../sales/general/clients/reducer.js'
import cart from '../sales/general/cart/reducer.js'
import priceList from '../sales/general/priceList/reducer.js'
import completed from '../sales/general/completed/reducer.js'
import extras from '../sales/general/extras/reducer.js'
import notes from './builder/reducer.js'
import currency from '../../general/currency/reducer.js'

export default combineReducers({
    fetching,
    layout,
    config,
    user,
    userProfile,
    generalItem,
    clients,
    products,
    cart,
    presales,
    priceList,
    completed,
    notes,
    currency,
    extras
})