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
    console.log('INDEX BEFORE', this.props.paginatedIndex)
    this.props.dispatch({type: `${this.props.namespace}_SET_PAGINATED_INDEX`, payload: this.props.paginatedIndex + 1})
  }

  prevPage(ev) {
    console.log('INDEX BEFORE', this.props.paginatedIndex)
    this.props.dispatch({type: `${this.props.namespace}_SET_PAGINATED_INDEX`, payload: this.props.paginatedIndex - 1})
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
    return <div className='pagination'>
      {prevBtn}
      {currentPageBtn}
      {nextBtn}
    </div>

  }

}
