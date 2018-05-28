import React from 'react'
import {Route} from 'react-router-dom'

//components
import Home from '../home/home.jsx'
import Payables from '../payables/main.jsx'

const routes = <div>
    <Route exact path='/payables' component={Home} />
    <Route path='/payables/duepay' component={Payables}/>
</div>

export default routes