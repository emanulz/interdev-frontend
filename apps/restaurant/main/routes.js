import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

// import Home from '../home/home.jsx'
import Presale from '../presale/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/restaurant/:id' component={Presale} />
  {/* <Route path='/seller/presale' component={Presale} /> */}

</div>

export default routes
