/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import { getItemDispatch } from '../../utils/api'

@connect((store) => {
  return {}
})
export default class Clients extends React.Component {

  componentWillMount() {
    // HERE DISPATCH THE FETCH CURRENCIES
    const currencyKwargs = {
      url: '/api/currency/?limit=10',
      successType: 'FETCH_CURRENCIES_FULFILLED',
      errorType: 'FETCH_CURRENCIES_REJECTED'
    }
    this.props.dispatch(getItemDispatch(currencyKwargs))
  }
  // Main Layout
  render() {
    return null
  }

}
