import React from 'react'
import {Route} from 'react-router-dom'

//import home and other subroutes
import Home from '../home/home.jsx'
import Builder from '../builder/main.jsx'

const routes = <div className='heigh100'>

    <Route exact path='/notes' component={Home} />
    <Route path='/notes/credit' component={Builder} />
    <Route path='/notes/debit' component={Builder} />

</div>

export default routes