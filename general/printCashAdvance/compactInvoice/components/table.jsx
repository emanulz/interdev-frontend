import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {cashAdvance: store.printCashAdvance.cashAdvance}
})
export default class Table extends React.Component {

  // Main Layout
  render() {

    return <div className='cash-advance-compact-invoice-table'>
      <div className='cash-advance-compact-invoice-table-header'>
        <div className='cash-advance-compact-invoice-table-header-description'>Concepto:</div>
      </div>
      <div className='cash-advance-compact-invoice-table-body'>
        <div className='cash-advance-compact-invoice-table-body-item'>
          <div className='cash-advance-compact-invoice-table-body-item-description'>
            {this.props.cashAdvance.description}
          </div>
        </div>
      </div>

    </div>

  }

}
