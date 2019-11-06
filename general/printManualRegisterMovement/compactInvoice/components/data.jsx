import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'

@connect((store) => {
  return {
    movement: store.printManualRegisterMovement.manualRegisterMovement,
    registerClosure: store.printManualRegisterMovement.registerClosure
  }
})
export default class Data extends React.Component {

  render() {
    // STYLES
    const fontFamily = 'Arial'
    const fontSize = '14px'

    const dataStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      padding: '10px 0'
    }

    const trStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold'
    }

    const thStyles = {
      width: '40%',
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      padding: '5px 0'
    }

    const tdStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold'
    }

    const movement = this.props.movement
    const registerClosure = this.props.registerClosure

    const date = movement.created
      ? `${formatDateTimeAmPm(movement.created)}`
      : `${formatDateTimeAmPm(new Date())}`

    const registerDate = registerClosure.created
      ? `${formatDateTimeAmPm(registerClosure.created)}`
      : `${formatDateTimeAmPm(new Date())}`

    const cashierName = registerClosure
      ? registerClosure.cashier_name
      : ''

    const consecutive = movement.id ? movement.id : '0001'
    const registerClosureConsecutive = registerClosure.id ? registerClosure.id : 'SIN CIERRE'

    return <div style={dataStyles}>

      <table>
        <tbody>
          <tr style={trStyles}>
            <th style={thStyles}>Fecha Mov:</th>
            <td style={tdStyles}>{date}</td>
          </tr>
          <tr style={trStyles}>
            <th style={thStyles}>Mov #:</th>
            <td style={tdStyles}>{consecutive}</td>
          </tr>
          <tr style={trStyles}>
            <th style={thStyles}>Fecha Cierre:</th>
            <td style={tdStyles}>{registerDate}</td>
          </tr>
          <tr style={trStyles}>
            <th style={thStyles}>Cierre #:</th>
            <td style={tdStyles}>{registerClosureConsecutive}</td>
          </tr>
          <tr style={trStyles}>
            <th style={thStyles}>Cajero:</th>
            <td style={tdStyles}>{cashierName}</td>
          </tr>

        </tbody>

      </table>

    </div>

  }

}
