import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Presales from './crud/list.jsx'
import Restaurant from './restaurant/crud/list.jsx'
import Quoting from './quoting/crud/list.jsx'
import Reserves from './reserves/crud/list.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/presales' component={Presales} />
  <Route exact path='/admin/presales/restaurant' component={Restaurant} />
  <Route exact path='/admin/presales/quoting' component={Quoting} />
  <Route exact path='/admin/presales/reserves' component={Reserves} />

</div>

export default routes
