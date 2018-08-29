import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Purchases from './purchases/main.jsx'

const routes = <div className='heigh100'>

  <Route path='/admin/invoicing/purchases' component={Purchases} />

</div>

export default routes
