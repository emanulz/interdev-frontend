import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Users from '../users/main.jsx'
import Clients from '../clients/main.jsx'
import Senders from '../senders/main.jsx'
import Suppliers from '../suppliers/main.jsx'
import Products from '../products/main.jsx'
import Permissions from '../permissions/main.jsx'
import ProductDepartments from '../productDepartments/main.jsx'
import ProductSubDepartments from '../productSubDepartments/main.jsx'
import Warehouses from '../warehouses/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin' component={Home} />
  <Route path='/admin/users' component={Users} />
  <Route path='/admin/clients' component={Clients} />
  <Route path='/admin/senders' component={Senders} />
  <Route path='/admin/products' component={Products} />
  <Route path='/admin/productdepartments' component={ProductDepartments} />
  <Route path='/admin/productsubdepartments' component={ProductSubDepartments} />
  <Route path='/admin/permissions' component={Permissions} />
  <Route path='/admin/suppliers' component={Suppliers} />
  <Route path='/admin/warehouses' component={Warehouses} />

</div>

export default routes
