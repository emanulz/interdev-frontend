import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './crud/list.jsx'
import Create from './crud/create.jsx'
import Update from './crud/update.jsx'

export default function routerBuilder(enabled_helpers){
  const sub_routes = []

  for(let helper of enabled_helpers){

    //build list route
    const list = <Route exact path={`/admin/helpers/${helper.trim()}`} component={List} />
    sub_routes.push(list)
    //build add route
    const create = <Route exact path={`/admin/helpers/${helper.trim()}/add`} component={Create} />
    sub_routes.push(create)
    //build edit route
    const edit = <Route exact path={`/admin/helpers/${helper.trim()}/edit/:id`} component={Update} />
    sub_routes.push(edit)
  }


return <div className='heigh100'>
    {sub_routes}
  </div>
}




