/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.cashier.fullWidth,
    registerClosure: store.registerClosure.registerClosure
  }
})
export default class Aside extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_CASHIER_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render () {
    const asideClass = this.props.fullWidth ? 'register-movements-aside collapsed' : 'register-movements-aside'

    const clusureCashCRC = this.props.registerClosure ? this.props.registerClosure.closure_money_crc_system_cash : 0
    const clusureCashUSD = this.props.registerClosure ? this.props.registerClosure.closure_money_usd_system_cash : 0

    return <div className={asideClass}>
      <h1>TOTALES</h1>
      {/* <h2>ENTRADAS</h2>
      <div className='register-movements-aside-tag'>
        ₡ 102.350,00
      </div>
      <h2>SALIDAS</h2>
      <div className='register-movements-aside-tag'>
        ₡ 50,00
      </div> */}
      <h2>TOTALES EFECTIVO COLONES</h2>
      <div className='cashier-aside-tag'>
        ₡ {parseFloat(clusureCashCRC).formatMoney()}
      </div>
      <h2>TOTALES EFECTIVO DOLARES</h2>
      <div className='cashier-aside-tag'>
        $ {parseFloat(clusureCashUSD).formatMoney()}
      </div>
    </div>
  }

}
