import React from 'react'
import {Route} from 'react-router-dom'

//componetns
import Home from '../home/home.jsx'
import Purchase from '../purchase/main.jsx'

const routes = <div className='heigh100'>
    <Route exact path='/purchases' component={Home} />
    <Route path='/purchases/add' component={Purchase}/>
</div>

export default routes