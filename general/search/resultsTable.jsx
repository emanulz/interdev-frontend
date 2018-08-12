/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../adminTable/adminTable.jsx'
import Fecthing from '../fetching/fetching.jsx'
import {getHeaderOrder} from './headerOrder.js'

@connect((store, ownProps) => {
  return {
    fething: store.fetching.fetching,
    searchResults: store[ownProps.namespace].searchResults,
    salesWarehouse: store.config.salesWarehouse,
    resultsActiveIndex: store[ownProps.namespace].activeIndex
  }
})
export default class ResultsTable extends React.Component {

  render() {

    const idField = 'id'

    const headerOrder = getHeaderOrder(this.props.model, this.props.salesWarehouse)

    const fetching = <Fecthing />
    const list = <AdminTable headerOrder={headerOrder} model={this.props.model} data={this.props.searchResults}
      idField={idField} onRowDoubleClick={this.props.onRowDoubleClick} onRowClick={this.props.onRowClick}
      activeIndex={this.props.resultsActiveIndex}
      sortedBy={this.props.sortedBy} onActiveItem={this.props.onActiveItem} />

    const content = this.props.fetching ? fetching : list

    return <div className='search-results'>
      <div className='search-results-table'>
        {content}
      </div>
    </div>

  }

}
