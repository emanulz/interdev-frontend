import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import List from '../list/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/inventories' component={Home} />
  <Route path='/inventories/list' component={List} />

</div>

export default routes
