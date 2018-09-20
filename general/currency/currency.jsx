/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'

@connect((store) => {
  return {}
})
export default class Clients extends React.Component {

  componentWillMount() {
    // HERE DISPATCH THE FETCH CURRENCIES
    console.log('CURRENCIES MOUNTED')
  }
  // Main Layout
  render() {
    return null
  }

}
