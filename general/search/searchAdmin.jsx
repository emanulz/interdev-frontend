import React from 'react'
import {connect} from 'react-redux'
import {searchItem, searchItemPaginated} from './actions.js'
@connect((store, ownProps) => {
  return {
    searchText: store[ownProps.namespace].searchText,
    searchResults: store[ownProps.namespace].searchResults,
    pageSize: store[ownProps.namespace].paginatedPageSize,
    paginatedIndex: store[ownProps.namespace].paginatedIndex,
    needsRefetch: store[ownProps.namespace].needsRefetch
  }
})
export default class SearchPanel extends React.Component {

  componentWillUpdate(nextProps) {
    const searchText = nextProps.searchText
    if (!searchText.length & this.props.searchText.length) {
      this.props.dispatch({type: `${this.props.namespace}_CLEAR_SEARCH_RESULTS`, payload: ''})
    }

  }

  componentDidUpdate(prevProps) {
    console.log('DID UPDATE PREV PROPS', prevProps)
    console.log('DID UPDATE CURRENT PROPS', this.props)
    if (this.props.needsRefetch && this.props.paginatedIndex != prevProps.paginatedIndex) {
      this.searchAction()
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
    const presale_type = this.props.presale_type ? this.props.presale_type : ''
    const offset = this.props.paginatedIndex * this.props.pageSize
    if (this.props.paginated) {
      this.props.dispatch(searchItemPaginated(text, this.props.model, this.props.namespace, this.props.clientId, presale_type, this.props.notDeleted, offset, this.props.pageSize))
    } else {
      this.props.dispatch(searchItem(text, this.props.model, this.props.namespace, this.props.clientId, presale_type, this.props.notDeleted))
    }
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
