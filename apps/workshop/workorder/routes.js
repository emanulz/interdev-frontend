import React from 'react'
import {Route} from 'react-router-dom'

//Route to sub components

import Create from './crud/create.jsx'
import List from './crud/list.jsx'


const routes = <div className='heigh100'>
    <Route path='/workshop/workorder/add' component={Create}/>
    <Route path='/workshop/workorder/edit' component={Create}/>
    <Route path='/workshop/workorder/list' component={List}/>
    
</div>

export default routes
