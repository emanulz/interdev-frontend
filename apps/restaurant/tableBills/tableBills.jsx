/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import NewBillPanel from './newBill/newBillPanel.jsx'
import {getItemDispatch} from './actions.js'

@connect((store) => {
  return {
    tables: store.tables.tables,
    tableActive: store.tables.tableActive
  }
})
export default class Sale extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'PRESALE_PANEL_MOUNTED', payload: ''})
    const tableId = this.props.location.pathname.split('/').pop()
    if (tableId) {
      this.props.dispatch({type: 'SET_TABLE_ACTIVE', payload: tableId})
      const tableBillsKwargs = {
        url: `/api/restauranttables/${tableId}/tablebills/`,
        successType: 'FETCH_TABLE_BILLS_FULFILLED',
        errorType: 'FETCH_TABLE_BILLS_REJECTED'
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(getItemDispatch(tableBillsKwargs))

    }
  }

  openNewBill() {
    this.props.dispatch({type: 'SHOW_NEW_BILL_PANEL', payload: ''})
  }

  // Main Layout
  render() {
    const tableSelected = this.props.tables.find(table => table.id == this.props.tableActive)
    const tableName = tableSelected ? tableSelected.indentifier : ''
    return <div className='table-bills'>
      <div className='table-bills-header'>
        <div className='table-bills-header-details'>
          Mesa: {tableName}
        </div>

        <div className='table-bills-header-add'>
          <button className='table-bills-header-add-btn btn btn-primary' onClick={this.openNewBill.bind(this)}>
            Agregar
            <i className='fa fa-plus' />
          </button>
        </div>

      </div>
      <NewBillPanel />
    </div>

  }

}
