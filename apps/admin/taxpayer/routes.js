import React from 'react'
import {Route} from 'react-router-dom'

//Route to subcomponents
import List from './views/list.jsx'

const routes = <div className='heigh100'>

    <Route exact path='/admin/taxpayers' component={List} />

</div>

export default routes