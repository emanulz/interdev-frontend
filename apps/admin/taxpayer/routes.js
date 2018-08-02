import React from 'react'
import {Route} from 'react-router-dom'

//Route to subcomponents
import List from './views/list.jsx'
import Form from './views/create.jsx'

const routes = <div className='heigh100'>

    <Route exact path='/admin/taxpayers' component={List} />
    <Route exact path='/admin/taxpayers/add' component={Form} />

</div>

export default routes