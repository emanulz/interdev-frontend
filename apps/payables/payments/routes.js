import React from 'react'
import {Route} from 'react-router-dom'

import MakePayment from './makePayment/main.jsx'
import Payment from './payment/main.jsx'
import ListPayments  from './payments/main.jsx'

const routes = <div className = 'heigh100'>

    <Route exact path='/payables/payment' component={MakePayment} /> 
    <Route exact path='/payables/payment/:code' component={Payment} />   
    <Route exact path='/payables/payments' component={ListPayments} />   

</div>

export default routes