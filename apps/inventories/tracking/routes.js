import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './list.jsx'
import ProductMovements from './productMovements/productMovements.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/inventories/tracking' component={List} />
  <Route exact path='/inventories/tracking/:code' component={ProductMovements} />
</div>

export default routes
