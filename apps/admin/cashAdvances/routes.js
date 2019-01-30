import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './crud/list.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/cashadvances' component={List} />

</div>

export default routes
