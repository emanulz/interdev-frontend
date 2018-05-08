import React from 'react'
import {Route} from 'react-router-dom'

//Route components

import Home from '../home/home.jsx'


const routes = <div className='heigh100'>
    <Route exact path='/workshop' component={Home}/>
</div>

export default routes