import React from 'react'
import {Route} from 'react-router-dom'

//Route components

import Home from '../home/home.jsx'
import WorkOrder from '../workorder/main.jsx'


const routes = <div className='heigh100'>
    <Route exact path='/workshop' component={Home}/>
    <Route path='/workshop/workorder' component={WorkOrder}/>
</div>

export default routes