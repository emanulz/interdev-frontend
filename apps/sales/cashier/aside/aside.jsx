/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.cashier.fullWidth
  }
})
export default class Aside extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_CASHIER_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render () {
    const asideClass = this.props.fullWidth ? 'cashier-aside collapsed' : 'cashier-aside'
    return <div className={asideClass}>
      <h1>TOTALES</h1>
      <h2>COLONES</h2>
      <div className='cashier-aside-tag'>
        ₡ 102.350,00
      </div>
      <h2>DÓLARES</h2>
      <div className='cashier-aside-tag'>
        $ 50,00
      </div>
      <button className='btn btn-success'>ABRIR CAJA</button>
      <button className='btn btn-danger'>CERRAR CAJA</button>
    </div>
  }

}
