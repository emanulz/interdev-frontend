import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './list.jsx'
import Statement from './statement/statement.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/credits/receivable' component={List} />
  <Route exact path='/credits/receivable/:code' component={Statement} />

</div>

export default routes
