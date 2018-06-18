import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './crud/list.jsx'
import Create from './crud/create.jsx'
import Update from './crud/update.jsx'
import ImportProducts from './prodImporter/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin/products' component={List} />
  <Route exact path='/admin/products/add' component={Create} />
  <Route exact path='/admin/products/edit/:product' component={Update} />
  <Route exact path='/admin/products/importproducts' component={ImportProducts}/>

</div>

export default routes
