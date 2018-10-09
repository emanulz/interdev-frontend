/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { getPaginationItemDispatch } from '../../utils/api.js'

@connect((store) => {
  return {
    pageSize: store.pagination.pageSize
  }
})
export default class ResultsPerPage extends React.Component {

  handleChange (ev) {
    const url = this.props.url.indexOf('?') != -1 ? `${this.props.url}&limit=${ev.target.value}` : `${this.props.url}?limit=${ev.target.value}`
    const size = ev.target.value
    const kwargs = {
      url: url,
      successType: this.props.successType,
      errorType: this.props.errorType
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPaginationItemDispatch(kwargs))
    this.props.dispatch({type: 'SET_PAGE_SIZE', payload: size})
    this.props.dispatch({type: 'SET_CURRENT_PAGE', payload: 1})
  }

  render() {

    return <div className='resultsPerPage'>
      <h1>Resultados por página:</h1>
      <select value={this.props.pageSize} onChange={this.handleChange.bind(this)}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
        <option value={40}>40</option>
        <option value={50}>50</option>
      </select>
    </div>
  }
}
