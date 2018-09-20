import { combineReducers } from 'redux'

import body from './body/reducer.js'
import user from './user/reducer.js'
import config from './config/reducer.js'
import permissions from './permissions/reducer.js'

export default combineReducers({
  body,
  user,
  config,
  permissions
})
