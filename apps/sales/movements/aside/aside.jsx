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
    const asideClass = this.props.fullWidth ? 'register-movements-aside collapsed' : 'register-movements-aside'
    return <div className={asideClass}>
      <h1>TOTALES</h1>
      <h2>ENTRADAS</h2>
      <div className='register-movements-aside-tag'>
        ₡ 102.350,00
      </div>
      <h2>SALIDAS</h2>
      <div className='register-movements-aside-tag'>
        ₡ 50,00
      </div>
      <h2>BALANCE</h2>
      <div className='register-movements-aside-tag'>
        ₡ 50,00
      </div>
    </div>
  }

}
