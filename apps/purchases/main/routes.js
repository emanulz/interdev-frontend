import React from 'react'
import {Route} from 'react-router-dom'

//components
import Home from '../home/home.jsx'
import Purchase from '../purchase/main.jsx'
import ListPurchases from '../purchase/list/main.jsx'
import ListIncompletePurchases from '../purchase/list_incomplete/main.jsx'
import Reports from '../reports/main.jsx'
import SmartPurchase from '../smart_purchase/main.jsx'

const routes = <div className='heigh100'>
    <Route exact path='/purchases' component={Home} />
    <Route path='/purchases/add' component={Purchase}/>
    <Route path='/purchases/xml_add' component={SmartPurchase}/>
    <Route path='/purchases/completelist' component={ListPurchases}/>
    <Route path='/purchases/incompletelist' component={ListIncompletePurchases}/>
    <Route path='/purchases/purchase/:purchase_number' render={(props)=><Purchase isEdit={true} {...props} />} />
    <Route path='/purchases/reports/' component={Reports} />
</div>

export default routes
