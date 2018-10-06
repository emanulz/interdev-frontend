import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return { registerClosure: store.printRegisterClosure.registerClosure }
})
export default class Table extends React.Component {

  // Main Layout
  render() {

    const closure = this.props.registerClosure

    const systemCredCRCTotal = parseFloat(closure.closure_money_crc_system_credits)
    const systemCardCRCTotal = parseFloat(closure.closure_money_crc_system_card)
    const systemTransferCRCTotal = parseFloat(closure.closure_money_crc_system_transfer)

    const systemCardCRC = systemCardCRCTotal
      ? <div className='print-register-closure-compact-invoice-table-item'>
        <h1>Tarjetas Sistema:</h1>
        <h2>₡{systemCardCRCTotal.formatMoney()}</h2>
      </div>
      : ''

    const systemCredCRC = systemCredCRCTotal
      ? <div className='print-register-closure-compact-invoice-table-item'>
        <h1>Créditos Sistema:</h1>
        <h2>₡{systemCredCRCTotal.formatMoney()}</h2>
      </div>
      : ''

    const systemTranCRC = systemTransferCRCTotal
      ? <div className='print-register-closure-compact-invoice-table-item'>
        <h1>Transferencias Sistema:</h1>
        <h2>₡{systemTransferCRCTotal.formatMoney()}</h2>
      </div>
      : ''

    // MONTOS EN EFECTIVO
    const systemCashCRCTotal = parseFloat(closure.closure_money_crc_system_cash)
    const systemCashCRC = <div className='print-register-closure-compact-invoice-table-item'>
      <h1>Efectivo Sistema:</h1>
      <h2>₡{systemCashCRCTotal.formatMoney()}</h2>
    </div>
    const cashierCashCRCTotal = parseFloat(closure.closure_money_crc_cashier)

    const cashierCashCRC = <div className='print-register-closure-compact-invoice-table-item'>
      <h1>Efectivo Cajero:</h1>
      <h2>₡{cashierCashCRCTotal.formatMoney()}</h2>
    </div>

    // BALANCE
    const balanceCRC = parseFloat(closure.close_balance_crc)
    const registerBalanceCRC = <div className='print-register-closure-compact-invoice-table-item'>
      <h1>Balance Colones:</h1>
      <h2>₡{balanceCRC.formatMoney()}</h2>
    </div>

    return <div className='print-register-closure-compact-invoice-table'>
      <div className='print-register-closure-compact-invoice-table-body'>
        {systemCardCRC}
        {systemTranCRC}
        {systemCredCRC}
        <hr />
        {systemCashCRC}
        {cashierCashCRC}
        <hr />
        {registerBalanceCRC}
      </div>

    </div>

  }

}
