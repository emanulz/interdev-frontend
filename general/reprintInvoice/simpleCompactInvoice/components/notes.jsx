import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    config: store.config.globalConf,
    receiptStyles: store.config.receiptStyles
  }
})
export default class Notes extends React.Component {

  getSingDiv(wasCredit) {
    if (wasCredit) {
      const singStyles = {
        fontWeight: 'bold',
        paddingTop: '10px'
      }
      const hrStyles = {
        marginTop: '40px',
        border: 'none',
        borderBottom: '1px solid black'
      }
      return <div style={singStyles}>
        <h1>Firma del Cliente:</h1>
        <hr style={hrStyles} />
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

    const fontFamily = this.props.receiptStyles.simpleCompactInvoiceFont ? this.props.receiptStyles.simpleCompactInvoiceFont : 'Arial'
    const fontSize = this.props.receiptStyles.simpleCompactInvoiceFontSize ? this.props.receiptStyles.simpleCompactInvoiceFontSize : '10px'
    const notesStyles = {
      width: '100%',
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'flex-start',
      marginTop: '20px',
      fontWeight: 'bold',
      fontFamily: fontFamily,
      fontSize: fontSize
    }

    return <div style={notesStyles}>
      {sing}
      <h1 style={{padding: '0', margin: '0'}}>Notas:</h1>
      <div style={{paddingBottom: '20px'}}>
        <div style={{paddingTop: '10px'}}>{notes}</div>
        <div style={{paddingTop: '10px'}}>{this.props.config.haciendaStatementText}</div>
      </div>

    </div>

  }

}
