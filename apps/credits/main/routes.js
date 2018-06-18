import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Receivable from '../receivable/main.jsx'
import Payment from '../payments/payments.jsx'
import PaymentList from '../payments/list.jsx'
import PaymentItem from '../payments/payment.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/credits' component={Home} />
  <Route path='/credits/receivable' component={Receivable} />
  <Route exact path='/credits/payment' component={Payment} />
  <Route exact path='/credits/payments' component={PaymentList} />
  <Route exact path='/credits/payments/:payment' component={PaymentItem} />

</div>

export default routes
