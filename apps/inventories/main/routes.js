import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Movements from '../movements/main.jsx'
import Warehouses from '../warehouses/main.jsx'
import Tracking from '../tracking/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/inventories' component={Home} />
  <Route path='/inventories/movements' component={Movements} />
  <Route path='/inventories/warehouses' component={Warehouses} />
  <Route path='/inventories/tracking' component={Tracking} />

</div>

export default routes
