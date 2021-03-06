/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store, ownProps) => {
  return {
    fething: store.fetching.fetching,
    pageSize: store[ownProps.namespace].paginatedPageSize,
    paginatedIndex: store[ownProps.namespace].paginatedIndex,
    hasNext: store[ownProps.namespace].hasNext,
    hasPrevious: store[ownProps.namespace].hasPrevious
  }
})
export default class PaginationResultsNextPrev extends React.Component {

  nextPage(ev) {
    this.props.dispatch({type: `${this.props.namespace}_SET_PAGINATED_INDEX`, payload: this.props.paginatedIndex + 1})
  }

  prevPage(ev) {
    this.props.dispatch({type: `${this.props.namespace}_SET_PAGINATED_INDEX`, payload: this.props.paginatedIndex - 1})
  }

  setPageSize(ev) {
    const size = parseInt(ev.target.value)
    this.props.dispatch({type: `${this.props.namespace}_SET_PAGINATED_PAGE_SIZE`, payload: size})
  }

  render() {

    const pageText = `${this.props.paginatedIndex + 1}`

    const currentPageBtn = <div key={pageText} className='pagination-item paginationActive' >
      {pageText}
    </div>

    const prevBtn = this.props.hasPrevious
      ? <div key='prev_btn' className='pagination-item' onClick={this.prevPage.bind(this)}>
        <i className='fa fa-chevron-left' />
      </div>
      : <div key='prev_btn' className='pagination-item itemDisabled'>
        <i className='fa fa-chevron-left' />
      </div>
    const nextBtn = this.props.hasNext
      ? <div key='next_btn' className='pagination-item' onClick={this.nextPage.bind(this)}>
        <i className='fa fa-chevron-right' />
      </div>
      : <div key='next_btn' className='pagination-item itemDisabled'>
        <i className='fa fa-chevron-right' />
      </div>

    const resultsPerPage = <div className='resultsPerPage'>
      <h1>Resultados Búsqueda por página:</h1>
      <select value={this.props.pageSize} onChange={this.setPageSize.bind(this)}>
        <option value={9}>10</option>
        <option value={19}>20</option>
        <option value={29}>30</option>
        <option value={39}>40</option>
        <option value={49}>50</option>
      </select>
    </div>

    return <div className='admin-list-results-pagination'>
      <div className='pagination'>
        {prevBtn}
        {currentPageBtn}
        {nextBtn}
      </div>
      {resultsPerPage}
    </div>

  }

}
