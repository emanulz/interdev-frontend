/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

@connect((store) => {
  return {
    tableBills: store.tableBills.tableBills,
    tableActive: store.tables.tableActive
  }
})
export default class Sale extends React.Component {

  // Main Layout
  render() {

    const items = this.props.tableBills.map(bill => {
      return <tr key={bill.id_presale}>
        <td>{bill.client_name}</td>
        <td>{bill.waiter_name}</td>
        <td>
          <Link to={`/restaurant/tables/${this.props.tableActive}/${bill.id_presale}`}>
            Abrir
          </Link>
        </td>
      </tr>
    })

    return <div className='table-bills-content'>
      <table className='table'>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Salonero</th>
            <th>Abrir</th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </table>

    </div>

  }

}
