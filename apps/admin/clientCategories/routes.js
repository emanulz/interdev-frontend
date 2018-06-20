import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './crud/list.jsx'
import Create from './crud/create.jsx'
import Update from './crud/update.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/clientcategories' component={List} />
  <Route exact path='/admin/clientcategories/add' component={Create} />
  <Route exact path='/admin/clientcategories/edit/:clientcategory' component={Update} />

</div>

export default routes
