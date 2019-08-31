import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './crud/list.jsx'
import Create from './crud/create.jsx'
import Update from './crud/update.jsx'
import Labels from './labels/labels.jsx'
import Importer from './importer/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/products' component={List} />
  <Route exact path='/admin/products/labels' component={Labels} />
  <Route exact path='/admin/products/add' component={Create} />
  <Route exact path='/admin/products/edit/:product' component={Update} />
  <Route exact path='/admin/products/importproducts' component={Importer} />

</div>

export default routes
