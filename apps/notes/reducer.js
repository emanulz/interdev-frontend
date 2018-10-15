import { combineReducers } from 'redux'
import layout from './layout/reducer.js'

import config from '../sales/config/reducer.js'
import fetching from '../../general/fetching/reducer.js'
import user from '../sales/user/reducer.js'
import userProfile from '../../general/userProfile/reducer.js'
import generalItem from '../sales/general/product/generalItem/reducer.js'

export default combineReducers({
    fetching,
    layout,
    config,
    user,
    userProfile,
    generalItem,
})