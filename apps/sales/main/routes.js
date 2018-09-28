import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

// import Home from '../home/home.jsx'
import Sale from '../sale/main.jsx'
import Cashier from '../cashier/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/sales' component={Sale} />
  <Route exact path='/sales/cashier' component={Cashier} />
  {/* <Route path='/sales/sale' component={Sale} /> */}

</div>

export default routes
