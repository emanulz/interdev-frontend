/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
@connect((store) => {
  return {
    fullWidth: store.cashier.fullWidth,
    moneyBills: store.cashier.moneyBills,
    openBillList: store.cashier.openBillList,
    registerClosure: store.registerClosure.registerClosure,
    byNotes: store.cashier.byNotes,
    openTotalCRC: store.cashier.openTotalCRC,
    openTotalUSD: store.cashier.openTotalUSD,
    closureTotalCRC: store.cashier.closureTotalCRC,
    closureTotalUSD: store.cashier.closureTotalUSD
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_CASHIER_FULL_WIDTH', payload: ''})
  }

  // HANDLE INPUT CHANGE
  handleInputChange(currency, event) {

    const target = event.target
    let value

    // const value = target.type === 'checkbox' ? target.checked : target.value
    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : 0
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const element = {
      currency_code: currency,
      value: name,
      amount: value
    }

    this.props.dispatch({type: 'ADD_TO_OPEN_BILLS_LIST', payload: element})

  }

  fieldFocus(ev) {
    ev.target.select()
  }

  getBillListAmount(value, currency, list) {
    const itemToGet = list.find(item => {
      return item.value == value && item.currency_code == currency
    })
    return itemToGet ? itemToGet.amount : ''
  }

  getTotalAmount(list, currency) {
    const filteredByCurrency = list.filter(item => {
      return item.currency_code == currency
    })
    let total = 0
    filteredByCurrency.forEach(element => {
      total += parseFloat(element.value) * parseFloat(element.amount)
    })
    return total
  }

  // handles the user setting the total instead of the individual notes
  handleTotalSetCRC(currencyCode, e) {
    this.props.dispatch({type: 'CLEAR_OPEN_BILLS_LIST'})
    if (currencyCode === 'CRC') {
      const crcTotal = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0
      this.props.dispatch({type: 'SET_TOTAL_CRC', payload: crcTotal})
    } else {
      const usdTotal = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0
      this.props.dispatch({type: 'SET_TOTAL_USD', payload: usdTotal})
    }
  }

  // Main Layout
  render() {
    const crcList = this.props.moneyBills.filter((bill) => bill.currency_code == 'CRC')
    const crcBills = crcList.map(bill => {
      return <div className='cashier-content-row' key={`${bill.value}_CRC`}>
        <h2>{parseInt(bill.value)}</h2>
        <input type='number' name={bill.value}
          onChange={this.handleInputChange.bind(this, 'CRC')}
          value={this.getBillListAmount(bill.value, 'CRC', this.props.openBillList)}
          onFocus={this.fieldFocus.bind(this)}
        />
      </div>
    })

    const usdList = this.props.moneyBills.filter((bill) => bill.currency_code == 'USD')
    const usdBills = usdList.map(bill => {
      return <div className='cashier-content-row' key={`${bill.value}_USD`}>
        <h2>{parseInt(bill.value)}</h2>
        <input type='number' name={bill.value}
          onChange={this.handleInputChange.bind(this, 'USD')}
          value={this.getBillListAmount(bill.value, 'USD', this.props.openBillList)}
          onFocus={this.fieldFocus.bind(this)}
        />
      </div>
    })

    return <div className='cashier-content-container'>
      <div className='cashier-content-crc'>
        <h1>COLONES ₡</h1>
        {crcBills}
        <div className='cashier-content-row row-totals'>
          <h2>Total ₡</h2>
          <input
            onChange={this.handleTotalSetCRC.bind(this, 'CRC')}
            value={this.props.openTotalCRC}
            type='number' name='total-crc' onFocus={this.fieldFocus.bind(this)} />
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
          <input
            onChange={this.handleTotalSetCRC.bind(this, 'USD')}
            value={this.props.openTotalUSD}
            type='number' name='total-usd' onFocus={this.fieldFocus.bind(this)} />
        </div>
      </div>
    </div>
  }

}
