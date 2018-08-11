import React from 'react'
import {connect} from 'react-redux'
import ResultsTable from './resultsTable.jsx'
import {searchItem} from './actions.js'
const Mousetrap = require('mousetrap')
@connect((store, ownProps) => {
  return {
    isVisible: store[ownProps.namespace].isVisible,
    searchText: store[ownProps.namespace].searchText,
    searchResults: store[ownProps.namespace].searchResults}
})
export default class SearchPanel extends React.Component {

  hidePanel() {
    Mousetrap.unbind('esc')
    Mousetrap.unbind('up')
    Mousetrap.unbind('down')
    this.props.dispatch({type: `${this.props.namespace}_TOGGLE_SEARCH_PANEL`, payload: -1})
  }

  inputKeyPress(ev) {
    if (ev.key == 'Enter') {
      ev.preventDefault()
      this.searchClientAction()
    } else {
      this.props.dispatch({type: `${this.props.namespace}_SET_SEARCH_TEXT`, payload: ev.target.value})
    }

  }

  searchClientAction() {
    const text = this.props.searchText
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(searchItem(text, this.props.model, this.props.namespace))
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'search-panel is-visible'
      : 'search-panel'

    return <div className={isVisible}>

      <div className='search-panel-main'>
        <div className='search-panel-header'>
          Busqueda de {this.props.modelText}
          <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
        </div>

        <div className='search-panel-input insideIcon'>
          <input
            id={`${this.props.namespace}-input-field`}
            className='mousetrap'
            type='text'
            placeholder='Ingrese un texto para buscar...'
            onChange={this.inputKeyPress.bind(this)}
            onKeyPress={this.inputKeyPress.bind(this)}
          />
          <i className='fa fa-search' onClick={this.searchClientAction.bind(this)} />
        </div>

        <div className='search-panel-results'>

          <ResultsTable model={this.props.model} sortedBy={this.props.sortedBy} namespace={this.props.namespace}
            onRowDoubleClick={this.props.onRowDoubleClick} onRowClick={this.props.onRowClick} />

        </div>

      </div>

    </div>

  }

}
