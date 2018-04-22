import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Clients from '../clients/main.jsx'

const routes = <div>

  <Route exact path='/admin' component={Home} />
  <Route path='/admin/clients' component={Clients} />

</div>

export default routes
