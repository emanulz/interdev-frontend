/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
@connect((store) => {
  return {
    closureCardTotalCRC: store.cashier.closureCardTotalCRC
  }
})
export default class Main extends React.Component {

  fieldFocus(ev) {
    ev.target.select()
  }

  // handles the user setting the total instead of the individual notes
  handleTotalSetCRC(currencyCode, e) {
    if (currencyCode == 'CRC') {
      const crcTotal = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0
      this.props.dispatch({type: 'SET_CLOSURE_CARD_TOTAL_CRC', payload: crcTotal})
    } else {
      return true
    }
  }

  // Main Layout
  render() {

    return <div className='cashier-content-container'>
      <div className='cashier-content-crc'>
        <h1>COLONES ₡</h1>
        <div className='cashier-content-row row-totals'>
          <h2>Total Cierre₡</h2>
          <input
            onChange={this.handleTotalSetCRC.bind(this, 'CRC')}
            value={this.props.closureCardTotalCRC}
            type='number' name='total-crc' onFocus={this.fieldFocus.bind(this)} />
        </div>
      </div>
    </div>
  }

}
