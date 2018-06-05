import React from 'react'
import {Switch, Route} from 'react-router-dom'

import MakePayment from './makePayment/main.jsx'
import Payment from './payment/main.jsx'
import ListPayments  from './listPayments/main.jsx'

const routes = <div className = 'heigh100'>
<Switch>
    <Route exact path='/payables/payment' component={MakePayment} /> 
    <Route exact path='/payables/payment/list/' component={ListPayments} />  
    <Route exact path='/payables/payment/:code' component={Payment} />   
</Switch>
</div>
export default routes