import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Purchases from './purchases/main.jsx'
import Tickets from './tickets/main.jsx'

const routes = <div className='heigh100'>

  <Route path='/admin/invoicing/purchases' component={Purchases} />
  <Route path='/admin/invoicing/tickets' component={Tickets} />

</div>

export default routes
