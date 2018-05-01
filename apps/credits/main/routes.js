import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Receivable from '../receivable/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/credits' component={Home} />
  <Route path='/credits/receivable' component={Receivable} />

</div>

export default routes
