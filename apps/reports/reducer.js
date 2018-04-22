import { combineReducers } from 'redux'

import body from './body/reducer.js'
import user from './user/reducer.js'

export default combineReducers({
  body,
  user
})
