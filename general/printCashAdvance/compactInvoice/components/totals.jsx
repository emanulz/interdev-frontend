import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    cashAdvance: store.printCashAdvance.cashAdvance
  }
})
export default class Totals extends React.Component {

  render() {

    const amount = this.props.cashAdvance.amount ? parseFloat(this.props.cashAdvance.amount) : 0

    return <div className='cash-advance-compact-invoice-totals'>

      <table>
        <tbody>
          <tr className='total-row'>
            <th>Total</th>
            <td>₡ {amount.formatMoney(2, ',', '.')}</td>
          </tr>
        </tbody>
      </table>

    </div>

  }

}
