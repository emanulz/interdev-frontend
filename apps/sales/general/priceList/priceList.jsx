/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'

@connect((store) => {
  return {
    listSelected: store.priceList.listSelected,
    config: store.config
  }
})
export default class priceList extends React.Component {

  priceListSelected(event) {
    const target = event.target
    const value = target.value
    this.props.dispatch({type: 'SET_PRICE_LIST', payload: value})
  }

  doNothing() {

  }

  // Main Layout
  render() {

    let retItem = <div />
    try {
      if (this.props.config.globalConf.usesMultiplePrices) {
        retItem = <div className='priceList-container'>
          <div className='priceList-container-select'>
            <h2>Lista de Precios</h2>
            <select onChange={this.priceListSelected.bind(this)} className='form-control'
              value={this.props.listSelected} >
              <option value='1'>Precio 1</option>
              <option value='2'>Precio 2</option>
              <option value='3'>Precio 3</option>
            </select>
          </div>

        </div>
      }
    } catch (err) { console.log(err) }

    // RETURNS ONLY THE ITEM IF THE CONF SAYS SO
    return <div className='priceList'>
      {retItem}
    </div>

  }

}
