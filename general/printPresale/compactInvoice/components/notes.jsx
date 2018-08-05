import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Notes extends React.Component {

  getSingDiv(wasCredit) {
    if (wasCredit) {
      return <div className='print-compact-presale-notes-sing'>
        <h1>Firma del Cliente:</h1>
        <hr />
      </div>
    }
  }

  render() {

    let wasCredit = false
    try {
      wasCredit = this.props.sale.pay.cred[0].amount
    } catch (err) {}
    const sing = this.getSingDiv(wasCredit)
    return <div className='print-compact-presale-notes'>
      {sing}
      <h1>Notas:</h1>
      <div className='print-compact-presale-notes-content'>
        <div>-</div>
      </div>

    </div>

  }

}
