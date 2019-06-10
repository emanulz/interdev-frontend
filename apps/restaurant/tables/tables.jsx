/*
 * Module dependencies
 */
import React from 'react'
import BillList from './billsList.jsx'
import {connect} from 'react-redux'
// import {Link} from 'react-router-dom'
import {getItemDispatch} from './actions.js'
import { getSingleItemDispatch } from '../../../utils/api.js'
import NewBillPanel from '../tableBills/newBill/newBillPanel.jsx'

@connect((store) => {
  return {
    tables: store.tables.tables,
    filledTables: store.tables.filledTables,
    tableActive: store.tables.tableActive
  }
})
export default class Sale extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'PRESALE_PANEL_MOUNTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_TABLE_BILLS', payload: ''})
    this.props.dispatch({type: 'CLEAR_TABLE_ACTIVE', payload: ''})

    const provinceKwargs = {
      url: '/api/restauranttables/tableswithbills/',
      successType: 'FETCH_FILLED_TABLES_FULFILLED',
      errorType: 'FETCH_FILLED_TABLES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getSingleItemDispatch(provinceKwargs))

  }

  setTableActive(tableId) {
    this.props.dispatch({type: 'CLEAR_TABLE_BILLS', payload: ''})

    this.props.dispatch({type: 'SET_TABLE_ACTIVE', payload: tableId})
    const tableBillsKwargs = {
      url: `/api/restauranttables/${tableId}/tablebills/`,
      successType: 'FETCH_TABLE_BILLS_FULFILLED',
      errorType: 'FETCH_TABLE_BILLS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(tableBillsKwargs))
  }

  // Main Layout
  render() {
    const sorted = this.props.tables.sort((a, b) => {

      if (a.indentifier != 'Barra' && b.indentifier == 'Barra') {
        return 1
      }
      if (b.indentifier != 'Barra' && a.indentifier == 'Barra') {
        return -1
      }
      const aNum = parseInt(a.indentifier.replace('Mesa ', ''))
      const bNum = parseInt(b.indentifier.replace('Mesa ', ''))

      return aNum - bNum
      // return ('' + aString).localeCompare(bString, {numeric: true})
    })
    const filled = this.props.filledTables
    const tableList = sorted.map(table => {
      let filledClass = filled.indexOf(table.id) != -1 ? 'filled' : ''
      // return <Link key={table.id} className={`tables-single ${filledClass}`} to={`/restaurant/tables/${table.id}`} >
      //   <div className='tables-single-identifier'>
      //     {table.indentifier}
      //   </div>
      // </Link>
      if (table.id == this.props.tableActive) {
        filledClass = `${filledClass} activeTable`
      }
      return <div key={table.id} className={`tables-single ${filledClass}`} onClick={this.setTableActive.bind(this, table.id)}>
        {table.indentifier}
      </div>
    })

    return <div className='tables'>
      <div className='tables-tables'>
        {tableList}
      </div>
      <BillList />
      <NewBillPanel />
    </div>

  }

}
