import React from 'react'
import {connect} from 'react-redux'
import {updateStoreTransferAmount, updateStoreTransferBank, updateStoreTransferNumber} from '../actions.js'

@connect((store) => {
  return {
    tranferAmount: store.pay.payObject.tran[0].amount,
    tranferBank: store.pay.payObject.tran[0].bank,
    transferNumber: store.pay.payObject.tran[0].transferNumber
  }
})
export default class PayTransfer extends React.Component {

  transferAmountChanged(ev) {

    this.props.dispatch(updateStoreTransferAmount(ev.target.value))
  }

  transferBankChanged(ev) {

    this.props.dispatch(updateStoreTransferBank(ev.target.value))
  }

  transferNumberChanged(ev) {

    this.props.dispatch(updateStoreTransferNumber(ev.target.value))
  }

  render() {

    return <div className='pay-method-body'>

      <div className='pay-method-body-header'>
        <span>Transferencia</span>
      </div>

      <div className='pay-method-body-content'>
        {/* <div className='pay-method-fileds'>
          <div className='pay-field cash'>
            <input type='text' name='pay-cash' id='pay-cash' placeholder='Monto' />
            <label for='pay-cash'>Efectivo</label>
          </div>

          <div className='pay-field card'>
            <input type='text' name='pay-card' id='pay-card' placeholder='Monto' />
            <label for='pay-card'>Tarjeta</label>
          </div>
        </div> */}
        <div className='pay-tag left'>MONTO:</div>
        <input value={this.props.tranferAmount} onChange={this.transferAmountChanged.bind(this)} type='Number' className='form-control' />
        <div className='pay-tag left'>BANCO:</div>
        <input value={this.props.tranferBank} onChange={this.transferBankChanged.bind(this)} type='Number' className='form-control' />
        <div className='pay-tag left'>REFERENCIA:</div>
        <input value={this.props.transferNumber} onChange={this.transferNumberChanged.bind(this)} type='Number' className='form-control' />

      </div>

    </div>

  }

}
