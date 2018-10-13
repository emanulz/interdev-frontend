import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Closures from './crud/list.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/registerclosures' component={Closures} />
  <Route exact path='/admin/registerclosures/:closure' component={Closures} />
  <Route exact path='/admin/registerclosures/:closure/movements' component={Closures} />

</div>

export default routes
