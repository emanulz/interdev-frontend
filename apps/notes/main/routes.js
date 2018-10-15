import React from 'react'
import {Route} from 'react-router-dom'

//import home and other subroutes
import Home from '../home/home.jsx'

const routes = <div className='heigh100'>

    <Route exact path='/home' component={Home} />

</div>

export default routes