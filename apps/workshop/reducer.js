import { combineReducers } from 'redux'

import fetching from '../../general/fetching/reducer.js'
import user from './user/reducer.js'
import layout from './layout/reducer.js'
import workorder from './workorder/reducer.js'
import clients from './general/clients/reducer.js'
import messages from './messages/reducer.js'


export default combineReducers({
    fetching,
    user,
    layout,
    workorder,
    clients,
    messages

})