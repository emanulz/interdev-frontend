import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './crud/list.jsx'
import Create from './crud/create.jsx'
import Update from './crud/update.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/productdepartments' component={List} />
  <Route exact path='/admin/productdepartments/add' component={Create} />
  <Route exact path='/admin/productdepartments/edit/:productdepartment' component={Update} />

</div>

export default routes
