/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import {recalcCart} from '../product/actions.js'

@connect((store) => {
  return {
    listSelected: store.priceList.listSelected,
    useListAsDefault: store.priceList.useAsDefault,
    config: store.config,
    cartItems: store.cart.cartItems,
    pricesDetails: store.products.pricesDetails
  }
})
export default class priceList extends React.Component {

  priceListSelected(event) {
    const target = event.target
    const value = target.value
    this.props.dispatch({type: 'SET_PRICE_LIST', payload: value})
    this.props.dispatch(recalcCart(this.props.cartItems, this.props.pricesDetails, value, this.props.useListAsDefault, false))
  }

  toggleUseListAsDefault(event) {
    const target = event.target
    const value = target.checked
    this.props.dispatch({type: 'SET_LIST_AS_DEFAULT', payload: value})
    this.props.dispatch(recalcCart(this.props.cartItems, this.props.pricesDetails, this.props.listSelected, value, false))
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
              <option key='1' value='1'>Precio 1</option>
              <option key='2' value='2'>Precio 2</option>
              <option key='3' value='3'>Precio 3</option>
            </select>
          </div>
          <div className='priceList-container-default'>
            <h2>Usar Lista</h2>
            <input checked={this.props.useListAsDefault}
              onChange={this.toggleUseListAsDefault.bind(this)}
              type='checkbox' className='form-control' />
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
