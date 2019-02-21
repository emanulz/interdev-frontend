import React from 'react'
import {Route} from 'react-router-dom'

//components
import Home from '../home/home.jsx'
import Purchase from '../purchase/main.jsx'
import ListPurchases from '../purchase/list/main.jsx'
import ListIncompletePurchases from '../purchase/list_incomplete/main.jsx'
import Reports from '../reports/main.jsx'
import SmartPurchase from '../smart_purchase/main.jsx'
import Prices_Prod from '../cross_ref_views/prices-prod/main.jsx'
import Sups_Prod from '../cross_ref_views/sups-prod/main.jsx'
import Prods_Sup from '../cross_ref_views/prods-sup/main.jsx'
import Purchases_Sup from '../cross_ref_views/purchases-sup/main.jsx'


const routes = <div className='heigh100'>
    <Route exact path='/purchases' component={Home} />
    <Route path='/purchases/add' component={Purchase}/>
    <Route path='/purchases/xml_add' component={SmartPurchase}/>
    <Route path='/purchases/completelist' component={ListPurchases}/>
    <Route path='/purchases/incompletelist' component={ListIncompletePurchases}/>
    <Route path='/purchases/purchase/:purchase_number' render={(props)=><Purchase isEdit={true} {...props} />} />
    <Route path='/purchases/reports/' component={Reports} />
    <Route path='/purchases/cross/prices-prod' component={Prices_Prod} />
    <Route path='/purchases/cross/sups-prod' component={Sups_Prod} />
    <Route path='/purchases/cross/prods-sup' component={Prods_Sup} />
    <Route path='/purchases/cross/purchases-sup' component={Purchases_Sup} />


</div>

export default routes
