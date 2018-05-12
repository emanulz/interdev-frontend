import React from 'react'
import {Route} from 'react-router-dom'

//Route to sub components

import Create from './crud/create.jsx'
import Update from './crud/update.jsx'
import List from './crud/list.jsx'
import WorkshopView from './workshopView/main.jsx'

const routes = <div className='heigh100'>
    <Route path='/workshop/workorder/add' component={Create}/>
    <Route path='/workshop/workorder/update' component={Update}/>
    <Route path='/workshop/workorder/list' component={List}/>
    <Route path='/workshop/workorder/workshopview' component={WorkshopView}/>
</div>

export default routes
