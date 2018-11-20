import React from 'react'
import {connect} from 'react-redux'
import ResultsTable from './resultsTable.jsx'
import {searchItem} from './actions.js'
import SearchImage from './searchImage.jsx'
const Mousetrap = require('mousetrap')
@connect((store, ownProps) => {
  return {
    isVisible: store[ownProps.namespace].isVisible,
    searchText: store[ownProps.namespace].searchText,
    searchResults: store[ownProps.namespace].searchResults,
    previousSearch: store[ownProps.namespace].previousSearch,
    activeCode: store[ownProps.namespace].activeCode
  }
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
      this.props.dispatch({type: `${this.props.namespace}_SET_PREVIOUS_SEARCH`, payload: ev.target.value})
      // IF ITS THE SAME SEARCH DO THE SET ACTION
      if (this.props.previousSearch == ev.target.value) {
        // HIDE PANEL
        if (this.props.setAction) {
          this.props.setAction(this.props.activeCode, this.props.dispatch)
        }
        // EXECUTE THE ACTION
      } else {
        // IF THE TEXT WAS CLEANED BUT THERE WAS A PREVIOUS SEARCH EXECUTHE THE ACTION
        if (this.props.previousSearch != '' && ev.target.value == '') {
          this.props.setAction(this.props.activeCode, this.props.dispatch)
        // ELSE DO THE SEARCH
        } else {
          this.searchAction()
        }
      }
    } else {
      this.props.dispatch({type: `${this.props.namespace}_SET_SEARCH_TEXT`, payload: ev.target.value})
    }

  }

  searchAction() {
    const text = this.props.searchText
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(searchItem(text, this.props.model, this.props.namespace))
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'search-panel is-visible'
      : 'search-panel'
    const imageComponent = this.props.useImage ? <SearchImage namespace={this.props.namespace} /> : <div />
    return <div className={isVisible}>

      <div className='search-panel-main'>
        <div className='search-panel-header'>
          Busqueda de {this.props.modelText}
          <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
        </div>

        {imageComponent}

        <div className='search-panel-input insideIcon'>
          <input
            id={`${this.props.namespace}-input-field`}
            className='mousetrap'
            type='text'
            placeholder='Ingrese un texto para buscar...'
            onChange={this.inputKeyPress.bind(this)}
            onKeyPress={this.inputKeyPress.bind(this)}
          />
          <i className='fa fa-search' onClick={this.searchAction.bind(this)} />
        </div>

        <div className='search-panel-results'>

          <ResultsTable model={this.props.model} sortedBy={this.props.sortedBy} namespace={this.props.namespace}
            onRowDoubleClick={this.props.onRowDoubleClick} onRowClick={this.props.onRowClick} onActiveItem={this.props.onActiveItem} />

        </div>

      </div>

    </div>

  }

}
