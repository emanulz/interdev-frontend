import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Presale from '../presale/main.jsx'
import Tables from '../tables/tables.jsx'
import TableBillss from '../tableBills/tableBills.jsx'
import ActionList from '../actionList/actionList.jsx'

const routes = <div className='heigh100'>
  <Route exact path='/restaurant' component={Home} />
  <Route exact path='/restaurant/tables' component={Tables} />
  <Route exact path='/restaurant/actions' component={ActionList} />
  <Route exact path='/restaurant/tables/:table' component={TableBillss} />
  <Route exact path='/restaurant/tables/:table/:presale' component={Presale} />
  {/* <Route path='/seller/presale' component={Presale} /> */}

</div>

export default routes
