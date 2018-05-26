import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import user from './user/reducer.js'
import layout from './layout/reducer.js'

export default combineReducers({
    user,
    fetching,
    layout,
})