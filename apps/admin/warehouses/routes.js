import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './crud/list.jsx'
import Create from './crud/create.jsx'
import Update from './crud/update.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/warehouses' component={List} />
  <Route exact path='/admin/warehouses/add' component={Create} />
  <Route exact path='/admin/warehouses/edit/:client' component={Update} />

</div>

export default routes
