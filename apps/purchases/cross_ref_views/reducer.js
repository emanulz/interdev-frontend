
import { combineReducers } from 'redux'

import cross_messages from './messages_reducer.js'
import cross_actions from './actions_reducer.js'

export default combineReducers({
    cross_actions,
    cross_messages
})