import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    registerClosure: store.printRegisterClosure.registerClosure,
    config: store.config.globalConf
  }
})
export default class Table extends React.Component {

  // Main Layout
  render() {

    const closure = this.props.registerClosure

    const systemCardCRCTotal = parseFloat(closure.closure_money_crc_system_card)
    const cashierCardCRCTotal = parseFloat(closure.closure_money_crc_cashier_card)
    const systemTransferCRCTotal = parseFloat(closure.closure_money_crc_system_transfer)
    const cashierTransferCRCTotal = parseFloat(closure.closure_money_crc_cashier_transfer)
    const systemRecoveryCRCTotal = parseFloat(closure.credit_recovery_money_crc_sub) + parseFloat(closure.credit_recovery_card_crc_sub) + parseFloat(closure.credit_recovery_transfer_crc_sub)
    const systemCreditNoteCRCTotal = parseFloat(closure.credit_note_money_crc_sub)
    const openingMoneyCRC = parseFloat(closure.opening_money_crc)
    const manualMovementsBlanceCRC = parseFloat(closure.manual_mov_crc_sub)

    const systemCashCRCTotal = parseFloat(closure.closure_money_crc_system_cash)
    const systemCredCRCTotal = parseFloat(closure.closure_money_crc_system_credits)

    // CALCIULATES THE TOTAL AMOUNT OF CASH SALES
    const totalCashSalesCRC = systemCashCRCTotal + systemTransferCRCTotal + systemCardCRCTotal - systemRecoveryCRCTotal - systemCreditNoteCRCTotal - openingMoneyCRC - manualMovementsBlanceCRC

    const systemCardCRC = systemCardCRCTotal || cashierCardCRCTotal
      ? <div>
        <div className='print-register-closure-compact-invoice-table-item'>
          <h1>Tarjetas Sistema:</h1>
          <h2>₡{systemCardCRCTotal.formatMoney()}</h2>
        </div>
        <div className='print-register-closure-compact-invoice-table-item'>
          <h1>Tarjetas Cajero:</h1>
          <h2>₡{cashierCardCRCTotal.formatMoney()}</h2>
        </div>
      </div>
      : ''

    const systemTranCRC = systemTransferCRCTotal || cashierTransferCRCTotal
      ? <div>
        <div className='print-register-closure-compact-invoice-table-item'>
          <h1>Transf Sistema:</h1>
          <h2>₡{systemTransferCRCTotal.formatMoney()}</h2>
        </div>
        <div className='print-register-closure-compact-invoice-table-item'>
          <h1>Transf Cajero:</h1>
          <h2>₡{cashierTransferCRCTotal.formatMoney()}</h2>
        </div>
      </div>
      : ''

    // MONTOS EN EFECTIVO
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
      <h1>Balance Efectivo Colones:</h1>
      <h2>₡{balanceCRC.formatMoney()}</h2>
    </div>

    const systemCredSalesCRC = <div className='print-register-closure-compact-invoice-table-item'>
      <h1>Ventas a Crédito:</h1>
      <h2>₡{systemCredCRCTotal.formatMoney()}</h2>
    </div>

    const systemCashSalesCRC = <div className='print-register-closure-compact-invoice-table-item'>
      <h1>Ventas de Contado:</h1>
      <h2>₡{totalCashSalesCRC.formatMoney()}</h2>
    </div>

    const systemTotalSalesCRC = <div className='print-register-closure-compact-invoice-table-item'>
      <h1>Ventas totales:</h1>
      <h2>₡{(systemCredCRCTotal + totalCashSalesCRC).formatMoney()}</h2>
    </div>

    const systemCNCRC = <div className='print-register-closure-compact-invoice-table-item'>
      <h1>Notas de Crédito totales:</h1>
      <h2>₡{systemCreditNoteCRCTotal.formatMoney()}</h2>
    </div>

    const systemRecoveryCRC = <div className='print-register-closure-compact-invoice-table-item'>
      <h1>Recuperaciónes de crédito:</h1>
      <h2>₡{systemRecoveryCRCTotal.formatMoney()}</h2>
    </div>

    const openingMoneyCRCDiv = <div className='print-register-closure-compact-invoice-table-item'>
      <h1>Monto de apertura:</h1>
      <h2>₡{openingMoneyCRC.formatMoney()}</h2>
    </div>

    const manualMovementsBalanceCRCDiv = <div className='print-register-closure-compact-invoice-table-item'>
      <h1>Balance Mov Manuales:</h1>
      <h2>₡{manualMovementsBlanceCRC.formatMoney()}</h2>
    </div>

    const depositTotal = this.props.config.printDepositTotalInRC
      ? <div className='print-register-closure-compact-invoice-table-item'>
        <h1>TOTAL A DEPOSITAR:</h1>
        <h2>₡{systemCashCRCTotal.formatMoney()}</h2>
      </div>
      : <div />

    return <div className='print-register-closure-compact-invoice-table'>
      <div className='print-register-closure-compact-invoice-table-body'>
        <hr />
        {openingMoneyCRCDiv}
        <hr />
        {systemCashSalesCRC}
        {systemCredSalesCRC}
        {systemTotalSalesCRC}
        <hr />
        RESUMEN:
        <hr />
        {manualMovementsBalanceCRCDiv}
        <hr />
        {systemCNCRC}
        <hr />
        {systemRecoveryCRC}
        <hr />
        {systemCardCRC}
        <hr />
        {systemTranCRC}
        <hr />
        {systemCashCRC}
        {cashierCashCRC}
        <hr />
        {registerBalanceCRC}
        <hr />
        FIN DEL RESUMEN
        <hr />
        {depositTotal}
      </div>

    </div>

  }

}
