import React from 'react'
import ReactDOM from 'react-dom'
import alertify from 'alertifyjs'

import formatMoney from '../../utils/formatMoney.js'
import printDiv from '../../utils/printDiv.js'

// REDUX PROVIDER
import {Provider} from 'react-redux'
// COMPONENTS
import Main from './main/main.jsx'

// STORE
import store from './store.js'

window.alertify = alertify
formatMoney()
window.printDiv = printDiv

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>, document.getElementById('app-container'))
