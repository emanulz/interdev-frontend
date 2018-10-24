/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

@connect((store) => {
  return {
    tables: store.tables.tables
  }
})
export default class Sale extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'PRESALE_PANEL_MOUNTED', payload: ''})
  }

  // Main Layout
  render() {
    const sorted = this.props.tables.sort((a, b) => {

      if (a.indentifier == 'Barra') {
        return false
      }
      if (b.indentifier == 'Barra') {
        return false
      }
      const aNum = parseInt(a.indentifier.replace('Mesa ', ''))
      const bNum = parseInt(b.indentifier.replace('Mesa ', ''))

      return aNum - bNum
      // return ('' + aString).localeCompare(bString, {numeric: true})
    })
    const tableList = sorted.map(table => {

      return <Link key={table.id} className='tables-single' to={`/restaurant/tables/${table.id}`} >
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
