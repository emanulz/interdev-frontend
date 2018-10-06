import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

// import Home from '../home/home.jsx'
import Sale from '../sale/main.jsx'
import Cashier from '../cashier/main.jsx'
import Movements from '../movements/main.jsx'
import SingleMovement from '../singleMovement/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/sales' component={Sale} />
  <Route exact path='/sales/cashier' component={Cashier} />
  <Route exact path='/sales/movements' component={Movements} />
  <Route exact path='/sales/singlemovements' component={SingleMovement} />
  {/* <Route path='/sales/sale' component={Sale} /> */}

</div>

export default routes
