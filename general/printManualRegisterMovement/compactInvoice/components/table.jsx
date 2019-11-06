import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {movement: store.printManualRegisterMovement.manualRegisterMovement}
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
      paddingTop: '10px'
    }

    const bodyStyles = {
      fontSize: fontSize,
      color: 'black',
      width: '100%',
      paddingTop: '5px'
    }

    const description = this.props.movement.description ? this.props.movement.description : ''
    const referenceDoc = this.props.movement.reference_doc ? this.props.movement.reference_doc : ''
    const type = this.props.movement.is_input ? 'ENTRADA' : 'SALIDA'

    return <div style={divStyles}>
      <div style={headerStyles}>
        <div>Tipo:</div>
      </div>
      <div style={bodyStyles}>
        {type}
      </div>
      <div style={headerStyles}>
        <div>Concepto:</div>
      </div>
      <div style={bodyStyles}>
        {description}
      </div>
      <div style={headerStyles}>
        <div>Documento de Referencia:</div>
      </div>
      <div style={bodyStyles}>
        {referenceDoc}
      </div>
    </div>

  }

}
