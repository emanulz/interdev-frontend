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

    const fontFamily = 'Arial'
    const fontSize = '16px'

    const divStyles = {
      marginTop: '10px',
      border: 'none',
      fontFamily: fontFamily,
      display: 'flex',
      justifyContent: 'flex-end'
    }

    const tableStyles = {
      width: '80%',
      border: 'none'
    }

    const thStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      padding: '5px 0',
      borderTop: '1px solid black',
      borderBottom: '1px solid black'
    }

    const tdStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
      textAlign: 'right'
    }

    return <div style={divStyles}>

      <table style={tableStyles}>
        <tbody>
          <tr>
            <th style={thStyles}>Total</th>
            <td style={tdStyles}>₡ {amount.formatMoney(2, ',', '.')}</td>
          </tr>
        </tbody>
      </table>

    </div>

  }

}
