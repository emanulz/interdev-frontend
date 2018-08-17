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

    const tableList = this.props.tables.map(table => {

      return <Link key={table.id} className='tables-single' to={`/restaurant/${table.id}`} >
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
