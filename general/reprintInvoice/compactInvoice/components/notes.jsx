import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale
  }
})
export default class Notes extends React.Component {

  getSingDiv(wasCredit) {
    if (wasCredit) {
      return <div className='reprint-compact-invoice-notes-sing'>
        <h1>Firma del Cliente:</h1>
        <hr />
      </div>
    }
  }

  render() {
    const sale = this.props.sale
    let wasCredit = false
    try {
      wasCredit = this.props.sale.pay.cred[0].amount
    } catch (err) {}
    const sing = this.getSingDiv(wasCredit)
    let extras = {
      notes: '',
      client: {
        last_name: 'General',
        name: 'Cliente',
        email: ''
      }
    }
    try {
      extras = sale.extras ? JSON.parse(sale.extras) : extras
    } catch (err) { console.log('EXTRAS ERROR PARSE', err) }
    const notes = extras.notes
    return <div className='reprint-compact-invoice-notes'>
      {sing}
      <h1>Notas:</h1>
      <div className='reprint-compact-invoice-notes-content'>
        <div>{notes}</div>
        <div>Autorizada mediante la resolucion N DGT-R-48-2016 del 7 de Octubre del 2016.</div>
      </div>

    </div>

  }

}
