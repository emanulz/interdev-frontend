/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import { getSingleItemDispatch } from '../../../utils/api.js'

@connect((store) => {
  return {
    tables: store.tables.tables,
    filledTables: store.tables.filledTables
  }
})
export default class Sale extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'PRESALE_PANEL_MOUNTED', payload: ''})

    const provinceKwargs = {
      url: '/api/restauranttables/tableswithbills/',
      successType: 'FETCH_FILLED_TABLES_FULFILLED',
      errorType: 'FETCH_FILLED_TABLES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getSingleItemDispatch(provinceKwargs))

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
      const filledClass = filled.indexOf(table.id) != -1 ? 'filled' : ''
      return <Link key={table.id} className={`tables-single ${filledClass}`} to={`/restaurant/tables/${table.id}`} >
        <div className='tables-single-identifier'>
          {table.indentifier}
        </div>
      </Link>
    })

    return <div className='tables'>
      {tableList}
    </div>

  }

}
