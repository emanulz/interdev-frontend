import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    config: store.config.globalConf
  }
})
export default class Notes extends React.Component {

  getSingDiv(wasCredit) {
    const data = this.props.config.useSignatureIdAndNameInCreditReceipt
      ? <div className='reprint-compact-invoice-notes-sing'>
        <h1>Firma del Cliente:</h1>
        <hr />
        <h1>Nombre:</h1>
        <hr />
        <h1>Cédula:</h1>
        <hr />
      </div>
      : <div className='reprint-compact-invoice-notes-sing'>
        <h1>Firma del Cliente:</h1>
        <hr />
      </div>
    if (wasCredit) {
      return data
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
        <div>{this.props.config.haciendaStatementText}</div>
      </div>

    </div>

  }

}
