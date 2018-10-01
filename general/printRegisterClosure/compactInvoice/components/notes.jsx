import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Notes extends React.Component {

  getSingDiv(wasCredit) {
    if (wasCredit) {
      return <div className='print-return-compact-invoice-notes-sing'>
        <h1>Firma del Cliente:</h1>
        <hr />
      </div>
    }
  }

  render() {

    return <div className='print-return-compact-invoice-notes'>
      <h1>Notas:</h1>
      <div>Autorizada mediante la resolucion N DGT-R-48-2016 del 7 de Octubre del 2016.</div>
      <div className='print-return-compact-invoice-notes-content'>
        <div className='print-return-compact-invoice-notes-sing'>
          <h1>Firma del Cliente:</h1>
          <hr />
        </div>
      </div>

    </div>

  }

}
