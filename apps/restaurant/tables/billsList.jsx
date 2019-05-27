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
export default class BillList extends React.Component {

  componentWillMount() {

  }

  openNewBill() {
    document.getElementById('newBillName').focus()
    this.props.dispatch({type: 'SHOW_NEW_BILL_PANEL', payload: ''})
  }

  // Main Layout
  render() {
    // <Link to={`/restaurant/tables/${this.props.tableActive}/${bill.id_presale}`}>
    //         Abrir
    //       </Link>
    const billList = this.props.tableBills.length
      ? this.props.tableBills.map(bill => {
        return <div className='tables-bill-list-body-bill'>
          <Link to={`/restaurant/tables/${this.props.tableActive}/${bill.id_presale}`} key={bill.id} className='tables-bill-list-body-bill-link'>
            {bill.client_name}
          </Link>
        </div>
      })
      : this.props.tableActive != ''
        ? <div className='tables-bill-list-body-bill noClickable'>NO HAY CUENTAS EN LA MESA</div>
        : <div className='tables-bill-list-body-bill noClickable'>NO HAY UNA MESA SELECCIONADA</div>

    const addClass = this.props.tableActive != '' ? 'tables-bill-list-add' : 'tables-bill-list-add disabled'
    return <div className='tables-bill-list'>
      <h1>Cuentas de la mesa Seleccionada</h1>
      <div className='tables-bill-list-body'>
        {billList}
      </div>
      <div className={addClass} onClick={this.openNewBill.bind(this)}>
        <i className='fa fa-plus' />
      </div>
    </div>

  }

}
