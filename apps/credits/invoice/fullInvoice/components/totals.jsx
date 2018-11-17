import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    payment: store.payments.paymentActive
  }
})
export default class Totals extends React.Component {

  render() {

    const total = this.props.payment ? parseFloat(this.props.payment.amount) : 0
    return <div className='full-invoice-totals'>
      <table>
        <tbody>
          <tr className='total-row'>
            <th>Total Este Pago</th>
            <td>₡ {total.formatMoney(2, ',', '.')}</td>
          </tr>
        </tbody>
      </table>

    </div>

  }

}
