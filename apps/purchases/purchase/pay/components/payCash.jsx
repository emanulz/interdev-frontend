import React from 'react'
import {connect} from 'react-redux'
import {updateStoreCashAmount} from '../actions.js'
import Select2 from 'react-select2-wrapper'

@connect((store) => {
  return {
    cashAmount: store.pay.cashAmount, 
    is_closed: store.purchase.is_closed,
    payMethodOptions: store.pay.payMethodOptions,
    payMethodOptionSelected: store.pay.payMethodOptionSelected,
    bank: store.pay.bank,
    transfer_reference: store.pay.transfer_reference,
  }
})
export default class PayCash extends React.Component {

  payAmountChanged(ev) {

    this.props.dispatch(updateStoreCashAmount(ev.target.value))
  }

  payDetailsChanged(e){
    this.props.dispatch({type: 'PAY_METHOD_OPTION_CHANGED', payload: e.target.value})
  }

  bankInputChanged(e){
    this.props.dispatch({type: 'BANK_INPUT_CHANGED', payload: e.target.value})
  }

  bankReferenceChanged(e){
    this.props.dispatch({type: 'BANK_REFERENCE_CHANGED', payload: e.target.value})
  }
  render() {

    let bank_input = ''
    let reference_input = ''
    //build inputs based on the selected method
    if(this.props.payMethodOptionSelected === "1"){
      bank_input = <div>
        <div className='pay-tag left'>Banco:</div>
        <input value={this.props.bank} onChange={this.bankInputChanged.bind(this)} type='text' className='form-control' />
      </div>

      reference_input =  <div>
        <div className='pay-tag left'>Referencia:</div>
        <input value={this.props.transfer_reference} onChange={this.bankReferenceChanged.bind(this)} type='text' className='form-control' />
      </div>
    }

    return <div className='pay-method-body'>

      <div className='pay-method-body-header'>
        <span>Efectivo</span>
      </div>

      <div className='pay-method-body-content'>
        
        <div className='pay-tag left'>MÉTODO PAGO:</div>
        <div className='pay-tag right' >
          <div className='pay-tag-select'>
          <Select2
              name='paymethod'
              className='form-control'
              onSelect={this.payDetailsChanged.bind(this)}
              data={this.props.payMethodOptions}
              value={this.props.payMethodOptionSelected}
              options={{
                  placeholder: 'Elija método..',
                  noResultsText: 'Sin elementos'}} /> 
          </div>
        </div>
        {bank_input}
        {reference_input}

        <br />
        <br />

      </div>

    </div>

  }

}
