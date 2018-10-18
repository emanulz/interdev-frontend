import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Purchases from './purchases/main.jsx'
import Tickets from './tickets/main.jsx'
import Invoices from './invoices/main.jsx'
import CreditNotes from './creditNotes/main.jsx'
import DebitNotes from './debitNotes/main.jsx'

const routes = <div className='heigh100'>

  <Route path='/admin/invoicing/purchases' component={Purchases} />
  <Route path='/admin/invoicing/tickets' component={Tickets} />
  <Route path='/admin/invoicing/invoices' component={Invoices} />
  <Route path='/admin/invoicing/creditnotes' component={CreditNotes} />
  <Route path='/admin/invoicing/debitnotes' component={DebitNotes} />

</div>

export default routes
