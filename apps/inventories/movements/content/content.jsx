/*
 * Module dependencies
 */
import React from 'react'

import Table from './table/table.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.movements.fullWidth
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'inventories-products fullWidth' : 'inventories-products'

    return <div className={contentClass}>
      <Table />
    </div>

  }

}
