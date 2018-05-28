import React from 'react'
import {Route} from 'react-router-dom'

//components
import Home from '../home/home.jsx'
import Payables from '../payables/main.jsx'
import Payments from '../payments/main.jsx'
const routes = <div>
    <Route exact path='/payables' component={Home} />
    <Route path='/payables/duepay' component={Payables}/>
    <Route path='/payables/payment' component={Payments}/>

</div>

export default routes