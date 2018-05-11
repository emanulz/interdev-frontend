import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
// import Sale from '../sale/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/inventories' component={Home} />
  {/* <Route path='/inventories/list' component={Sale} /> */}

</div>

export default routes
