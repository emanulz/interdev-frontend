import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

// import Home from '../home/home.jsx'
import MoneyReturn from '../moneyReturn/main.jsx'

const routes = <div className='heigh100'>

  <Route path='/returns/moneyreturn/:sale' component={MoneyReturn} />

</div>

export default routes
