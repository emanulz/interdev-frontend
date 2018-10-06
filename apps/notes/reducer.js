import { combineReducers } from 'redux'
import layout from './layout/reducer.js'

import config from '../sales/config/reducer.js'
import fetching from '../../general/fetching/reducer.js'

export default combineReducers({
    fetching,
    layout,
    config
})