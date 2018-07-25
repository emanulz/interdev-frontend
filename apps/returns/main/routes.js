import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

// import Home from '../home/home.jsx'
import MoneyReturn from '../moneyReturn/main.jsx'
import ListSales from '../salesList/main.jsx'
import ListReturns from '../returnsList/list.jsx'

const routes = <div className='heigh100'>
  <Route exact path='/returns' component={ListReturns} />
  <Route exact path='/returns/moneyreturn' component={ListSales} />
  <Route path='/returns/moneyreturn/:sale' component={MoneyReturn} />

</div>

export default routes
