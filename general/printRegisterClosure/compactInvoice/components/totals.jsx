import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    creditNote: store.printReturn.credit_note
  }
})
export default class Totals extends React.Component {

  render() {
    const creditNote = this.props.creditNote
    // SET THE DEFAULT VALUES
    let total = 0
    let taxes = 0
    let subTotal = 0
    // LOAD ITEMS FROM SALE ONLY IF LOADED
    if (Object.keys(creditNote).length > 0) {
      total = parseFloat(creditNote.amount)
      taxes = parseFloat(creditNote.taxes_amount)
      subTotal = parseFloat(creditNote.subtotal_amount)
    }

    return <div className='print-return-compact-invoice-totals'>

      <table>
        <tbody>
          <tr>
            <th>Sub-total Dev</th>
            <td>₡ {subTotal.formatMoney(2, ',', '.')}</td>

          </tr>
          <tr>
            <th>IV Dev</th>
            <td>₡ {taxes.formatMoney(2, ',', '.')}</td>
          </tr>
          <tr className='total-row'>
            <th>Total dev</th>
            <td>₡ {total.formatMoney(2, ',', '.')}</td>
          </tr>
        </tbody>
      </table>

    </div>

  }

}
