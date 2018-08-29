import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './crud/list.jsx'
import Accept from './crud/accept.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/invoicing/invoices' component={List} />
  <Route exact path='/admin/invoicing/invoices/:invoice' component={Accept} />

</div>

export default routes
