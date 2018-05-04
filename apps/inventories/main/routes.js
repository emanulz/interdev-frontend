import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Receivable from '../receivable/main.jsx'
import Payments from '../payments/payments.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/credits' component={Home} />
  <Route path='/credits/receivable' component={Receivable} />
  <Route path='/credits/payments' component={Payments} />

</div>

export default routes
