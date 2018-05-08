import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Receivable from '../receivable/main.jsx'
import Payment from '../payments/payments.jsx'
import PaymentList from '../payments/list.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/credits' component={Home} />
  <Route path='/credits/receivable' component={Receivable} />
  <Route path='/credits/payment' component={Payment} />
  <Route path='/credits/payments' component={PaymentList} />

</div>

export default routes
