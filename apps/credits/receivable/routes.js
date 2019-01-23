import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import List from './list.jsx'
import UnpaidSales from './unpaidSales/unpaidSales.jsx'
import PaymentList from './paymentList/paymentList.jsx'
import saleMovements from './saleMovements/saleMovements.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/credits/receivable' component={List} />
  <Route exact path='/credits/receivable/:code' component={UnpaidSales} />
  <Route exact path='/credits/receivable/payments/list/:code' component={PaymentList} />
  <Route exact path='/credits/receivable/:code/:sale' component={saleMovements} />
</div>

export default routes
