import React from 'react'
import {Route} from 'react-router-dom'

//Route to sub components

import Create from './crud/create.jsx'
import List from './crud/list.jsx'
import List_Internal_Warranty from './crud/list_internal_warranty.jsx'
import List_BD_Warranty  from './crud/list_bd_warranty.jsx'
import List_No_Repair from './crud/list_no_repair.jsx'


const routes = <div className='heigh100'>
    <Route path='/workshop/workorder/add' component={Create}/>
    <Route path='/workshop/workorder/edit' component={Create}/>
    <Route path='/workshop/workorder/list' component={List}/>
    <Route path='/workshop/workorder/listinternal' component={List_Internal_Warranty}/>
    <Route path='/workshop/workorder/listbd' component={List_BD_Warranty}/>
    <Route path='/workshop/workorder/listnr' component={List_No_Repair}/>
</div>

export default routes
