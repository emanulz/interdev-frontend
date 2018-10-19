/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import AdminTable from '../../../../../../general/adminTable/adminTable.jsx'
@connect((store) => {
  return {
    movements: store.registerclosures.registerClosureActiveMovements,
    registerClosure: store.registerclosures.registerClosureActive
  }
})
export default class Content extends React.Component {

  // Main Layout
  render() {

    const headerOrder = [
      {
        field: 'id',
        text: 'Consecutivo'
      }, {
        field: 'is_input',
        text: 'Es ingreso?',
        type: 'bool'
      }, {
        field: 'amount',
        text: 'Monto'
      }, {
        field: 'description',
        text: 'Descripción'
      }, {
        field: 'coin',
        text: 'Moneda'
      }, {
        field: 'created',
        text: 'Fecha',
        type: 'date'
      }
    ]

    const fetching = <div />
    const tableData = this.props.movements
    const list = <AdminTable headerOrder={headerOrder} model='registerMovements' data={tableData}
      idField='id' defaultDescending defaultSorting='id' />

    const content = this.props.fetching ? fetching : list

    const registerClosureId = this.props.registerClosure.id ? this.props.registerClosure.id : ''
    const cashierName = this.props.registerClosure ? this.props.registerClosure.cashier_name : ''

    return <div className='register-movements-content'>
      <h1>MOVIMIENTOS DE CAJA #{registerClosureId}</h1>
      <h1>CAJERO: {cashierName}</h1>
      {content}
    </div>

  }

}
