import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.sales.saleActive
  }
})
export default class Notes extends React.Component {

  render() {

    const fontFamily = 'Arial'
    const fontSize = '15px'

    const divStyles = {
      border: 'none',
      fontFamily: fontFamily,
      width: '100%',
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'flex-start',
      marginTop: '20px'
    }

    return <div style={divStyles}>
      <h1>Notas:</h1>
      <div className='cash-advance-compact-invoice-notes-content'>
        <div />
      </div>

    </div>

  }

}
