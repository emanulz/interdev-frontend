import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {cashAdvance: store.printCashAdvance.cashAdvance}
})
export default class Table extends React.Component {

  // Main Layout
  render() {
    const fontFamily = 'Arial'
    const fontSize = '15px'

    const divStyles = {
      border: 'none',
      fontFamily: fontFamily
    }

    const headerStyles = {
      fontSize: fontSize,
      color: 'black',
      width: '100%',
      display: 'flex',
      flexFlow: 'row',
      fontWeight: 'bold',
      padding: '10px 0'
    }

    const bodyStyles = {
      fontSize: fontSize,
      color: 'black',
      width: '100%',
      padding: '10px 0'
    }

    return <div style={divStyles}>
      <div style={headerStyles}>
        <div>Concepto:</div>
      </div>
      <div style={bodyStyles}>
        {this.props.cashAdvance.description}
      </div>
    </div>

  }

}
