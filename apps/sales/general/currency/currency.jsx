/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'

@connect((store) => {
  return {
    currencies: store.currency.currencies,
    currency: store.currency.currencySelected,
    exchange: store.currency.exchangeRateSelected,
    config: store.config
  }
})
export default class Currency extends React.Component {

  currencySelected(event) {
    const target = event.target
    const value = target.value
    this.props.dispatch({type: 'SET_CURRENCY', payload: value})
  }

  exchangeRateChanged(event) {
    const target = event.target
    const value = target.value
    this.props.dispatch({type: 'SET_EXCHANGE_RATE', payload: value})
  }

  doNothing() {

  }

  // Main Layout
  render() {

    let retItem = <div />
    const options = this.props.currencies.map(currency => {
      return <option key={currency.currency_code} value={currency.currency_code}>{currency.currency_name}</option>
    })

    try {
      if (this.props.config.globalConf.usesOtherCurrencies) {
        retItem = <div className='currency-container'>
          <div className='currency-container-value'>
            <h2>Moneda</h2>
            <select onChange={this.currencySelected.bind(this)} className='form-control'
              value={this.props.currency} >
              {options}
            </select>
          </div>

          <div className='currency-container-exchange-rate'>
            <h2>Tipo de Cambio</h2>
            <input type='number' value={this.props.exchange} onChange={this.exchangeRateChanged.bind(this)} />
          </div>

        </div>
      }
    } catch (err) { console.log(err) }

    // RETURNS ONLY THE ITEM IF THE CONF SAYS SO
    return <div className='currency'>
      {retItem}
    </div>

  }

}
