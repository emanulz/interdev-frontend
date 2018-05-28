import React from 'react'
import {Route} from 'react-router-dom'

import DuePayList from './duePayList/main.jsx'
import UnpaidPurchases from './unpaidPurchases/main.jsx'
import PurchaseMovementsList  from './purchaseMovements/main.jsx'

const routes = <div className = 'heigh100'>

    <Route exact path='/payables/duepay' component={DuePayList} /> 
    <Route exact path='/payables/duepay/:code' component={UnpaidPurchases} />   
    <Route exact path='/payables/duepay/:code/:purchase' component={PurchaseMovementsList} />   

</div>

export default routes