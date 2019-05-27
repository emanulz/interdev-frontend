/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    tableBills: store.tableBills.tableBills,
    tableActive: store.tables.tableActive
  }
})
export default class BillList extends React.Component {

  componentWillMount() {

  }

  // Main Layout
  render() {

    const billList = this.props.tableBills.length
      ? this.props.tableBills.map(bill => {
        return <div key={bill.id} className='tables-bill-list-body-bill'>
          {bill.client_name}
        </div>
      })
      : this.props.tableActive != ''
        ? <div>NO HAY CUENTAS EN LA MESA</div>
        : <div>NO HAY UNA MESA SELECCIONADA</div>

    const addClass = this.props.tableActive != '' ? 'tables-bill-list-add' : 'tables-bill-list-add disabled'
    return <div className='tables-bill-list'>
      <h1>Cuentas de la mesa Seleccionada</h1>
      <div className='tables-bill-list-body'>
        {billList}
      </div>
      <div className={addClass}>
        <i className='fa fa-plus' />
      </div>
    </div>

  }

}
