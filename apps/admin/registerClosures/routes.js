import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Closures from './crud/list.jsx'
import SingleClosure from './crud/singleClosure/singleClosure.jsx'
import Movements from './crud/movements/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/registerclosures' component={Closures} />
  <Route exact path='/admin/registerclosures/:closure' component={SingleClosure} />
  <Route exact path='/admin/registerclosures/:closure/movements' component={Movements} />

</div>

export default routes
