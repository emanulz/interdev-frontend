/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
@connect((store) => {
  return {
    fullWidth: store.cashier.fullWidth,
    moneyBills: store.cashier.moneyBills
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_CASHIER_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'cashier-content fullWidth' : 'cashier-content'
    const crcList = this.props.moneyBills.filter((bill) => bill.currency_code == 'CRC')
    const crcBills = crcList.map(bill => {
      return <div className='cashier-content-row'>
        <h2>{parseInt(bill.value)}</h2>
        <input type='number' name={bill.value} />
      </div>
    })

    const usdList = this.props.moneyBills.filter((bill) => bill.currency_code == 'USD')
    const usdBills = usdList.map(bill => {
      return <div className='cashier-content-row'>
        <h2>{parseInt(bill.value)}</h2>
        <input type='number' name={bill.value} />
      </div>
    })

    return <div className={contentClass}>
      <div className='cashier-content-tittle'>
        Apertura/Cierre de Caja
      </div>
      <div className='cashier-content-container'>
        <div className='cashier-content-crc'>
          <h1>COLONES ₡</h1>
          {crcBills}
          <div className='cashier-content-row row-totals'>
            <h2>Total ₡</h2>
            <input type='number' name='total-crc' />
          </div>

        </div>
        <div className='cashier-content-usd'>
          <h1>DÓLARES $</h1>
          {usdBills}
          <div className='cashier-content-row row-totals'>
            <h2>T. Cambio</h2>
            <input type='number' name='exchange-usd' />
          </div>
          <div className='cashier-content-row row-totals'>
            <h2>Total $</h2>
            <input type='number' name='total-usd' />
          </div>
        </div>
      </div>

    </div>

  }

}
