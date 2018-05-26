import React from 'react'
import {Route} from 'react-router-dom'

//components
import Home from '../home/home.jsx'

const routes = <div>
    <Route exact path='/payables' component={Home} />
</div>

export default routes