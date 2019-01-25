import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components
import SalesclerkSummary from './components/summary/main.jsx'

const routes = <div className='heigh100'>

    <Route exact path='/admin/salesclerks' component={SalesclerkSummary} />

</div>

export default routes
