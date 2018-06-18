import React from 'react'
import {connect} from 'react-redux'
import {searchItem} from './actions.js'
@connect((store, ownProps) => {
  return {
    searchText: store[ownProps.namespace].searchText,
    searchResults: store[ownProps.namespace].searchResults}
})
export default class SearchPanel extends React.Component {

  componentWillUpdate(nextProps) {
    const searchText = nextProps.searchText
    if (!searchText.length & this.props.searchText.length) {
      this.props.dispatch({type: `${this.props.namespace}_CLEAR_SEARCH_RESULTS`, payload: ''})
    }
  }

  inputKeyPress(ev) {

    if (ev.key == 'Enter') {
      ev.preventDefault()
      this.searchAction()
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

    return <div className='admin-list-search insideIcon'>
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

  }

}
