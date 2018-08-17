import React from 'react'
import {connect} from 'react-redux'
// import ResultsTable from './resultsTable.jsx'
import RestaurantDepartments from './departmentsBar.jsx'
import ProductGrid from './productsGrid.jsx'
import {searchItem} from './actions.js'
const Mousetrap = require('mousetrap')
@connect((store) => {
  return {
    isVisible: store.searchRestaurant.isVisible,
    searchText: store.searchRestaurant.searchText,
    searchResults: store.searchRestaurant.searchResults
  }
})
export default class SearchPanel extends React.Component {

  hidePanel() {
    Mousetrap.unbind('esc')
    Mousetrap.unbind('up')
    Mousetrap.unbind('down')
    this.props.dispatch({type: `productSearch_TOGGLE_SEARCH_PANEL`, payload: -1})
  }

  inputKeyPress(ev) {
    if (ev.key == 'Enter') {
      ev.preventDefault()
      this.searchClientAction()
    } else {
      this.props.dispatch({type: `SEARCH_RESTAURANT_SET_SEARCH_TEXT`, payload: ev.target.value})
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
          Agregar Producto
          <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
        </div>

        <div className='search-panel-input insideIcon'>
          <input
            id={`productSearch-input-field`}
            className='mousetrap'
            type='text'
            placeholder='Ingrese un texto para buscar...'
            onChange={this.inputKeyPress.bind(this)}
            onKeyPress={this.inputKeyPress.bind(this)}
          />
          <i className='fa fa-search' onClick={this.searchClientAction.bind(this)} />
        </div>

        <div className='search-panel-results'>

          <RestaurantDepartments />
          <ProductGrid onDoubleClick={this.props.onRowDoubleClick} />

          {/* <ResultsTable model={this.props.model} sortedBy={this.props.sortedBy} namespace={this.props.namespace}
            onRowDoubleClick={this.props.onRowDoubleClick} onRowClick={this.props.onRowClick} onActiveItem={this.props.onActiveItem} /> */}

        </div>

      </div>

    </div>

  }

}
