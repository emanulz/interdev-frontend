import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Users from '../users/main.jsx'
import TaxPayer from '../taxpayer/main.jsx'
import Clients from '../clients/main.jsx'
import Senders from '../senders/main.jsx'
import Suppliers from '../suppliers/main.jsx'
import Products from '../products/main.jsx'
import Permissions from '../permissions/main.jsx'
import ProductDepartments from '../productDepartments/main.jsx'
import ProductSubDepartments from '../productSubDepartments/main.jsx'
import Warehouses from '../warehouses/main.jsx'
import ClientCategories from '../clientCategories/main.jsx'
import Sales from '../sales/main.jsx'
import GeneralReports from '../reports/main.jsx'
import Invoicing from '../invoicing/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/admin' component={Home} />
  <Route path='/admin/users' component={Users} />
  <Route path='/admin/taxpayers' component={TaxPayer} />
  <Route path='/admin/clients' component={Clients} />
  <Route path='/admin/clientcategories' component={ClientCategories} />
  <Route path='/admin/senders' component={Senders} />
  <Route path='/admin/products' component={Products} />
  <Route path='/admin/productdepartments' component={ProductDepartments} />
  <Route path='/admin/productsubdepartments' component={ProductSubDepartments} />
  <Route path='/admin/permissions' component={Permissions} />
  <Route path='/admin/suppliers' component={Suppliers} />
  <Route path='/admin/warehouses' component={Warehouses} />
  <Route path='/admin/sales' component={Sales} />
  <Route path='/admin/reports' component={GeneralReports} />
  <Route path='/admin/invoicing' component={Invoicing} />

</div>

export default routes
