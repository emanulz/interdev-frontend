import React from 'react'

import Header from './components/header.jsx'
import Table from './components/table.jsx'
import Data from './components/data.jsx'
import Totals from './components/totals.jsx'
import Notes from './components/notes.jsx'
import WorkOrderData from './components/workshopData.jsx'

export default class CompactInvoice extends React.Component {

  render() {

    return <div className='print-compact-presale'>

      <Header />
      <Data />
      <WorkOrderData />
      <Table />
      <Totals />
      <Notes />

    </div>

  }

}
