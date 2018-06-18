import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Return from '../return/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/returns' component={Home} />
  <Route path='/returns/return' component={Return} />

</div>

export default routes
