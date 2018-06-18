import React from 'react'
import {Route} from 'react-router-dom'

//components
import Home from '../home/home.jsx'
import Purchase from '../purchase/main.jsx'
import ListPurchases from '../purchase/list/main.jsx'

const routes = <div className='heigh100'>
    <Route exact path='/purchases' component={Home} />
    <Route path='/purchases/add' component={Purchase}/>
    <Route path='/purchases/list' component={ListPurchases}/>
    <Route path='/purchases/purchase/:purchase_number' render={(props)=><Purchase isEdit={true} {...props} />} />
</div>

export default routes
