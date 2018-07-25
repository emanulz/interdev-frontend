/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Add from './add/add.jsx'
import Cart from './cart/cart.jsx'

@connect((store) => {
  return {
  }
})
export default class Content extends React.Component {

  // Main Layout
  render() {

    return <div className='take-movements-content'>
      <h1>Agregar movimientos:</h1>
      <Add />
      <Cart />
    </div>

  }

}
