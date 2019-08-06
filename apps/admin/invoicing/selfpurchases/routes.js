import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './crud/list.jsx'
import Create from './crud/create.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/invoicing/selfpurchases' component={List} />
  <Route exact path='/admin/invoicing/selfpurchases/create' component={Create} />
  {/* <Route exact path='/admin/invoicing/tickets/:ticket' component={Accept} /> */}

</div>

export default routes
