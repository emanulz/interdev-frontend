import React from 'react'
import ReactDOM from 'react-dom'
import alertify from 'alertifyjs'

// REDUX PROVIDER
import {Provider} from 'react-redux'
// COMPONENTS
import Main from './main/main.jsx'

// STORE
import store from './store.js'

window.alertify = alertify

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>, document.getElementById('app-container'))

if (module.hot) {
  module.hot.accept()
}
