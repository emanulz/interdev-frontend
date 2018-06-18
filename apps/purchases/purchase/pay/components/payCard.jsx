import React from 'react'
import {connect} from 'react-redux'
import {updateStoreCardAuth, updateStoreCardDigits} from '../actions'

@connect((store) => {
  return {cardAuth: store.pay.cardAuth, 
    cardDigits: store.pay.cardDigits, 
    cardAmount: store.pay.cardAmount,
    is_closed: store.purchase.is_closed,
  }
})
export default class PayCard extends React.Component {

  payCardAuthChanged(ev) {

    this.props.dispatch(updateStoreCardAuth(ev.target.value))
  }

  payCardDigitsChanged(ev) {

    this.props.dispatch(updateStoreCardDigits(ev.target.value))
  }

  payCardAmountChanged(e){
    const amount = parseFloat(e.target.value)?parseFloat(e.target.value):-1
    if(amount == -1){return}
    this.props.dispatch({type:'UPDATE_CARD_AMOUNT', payload: amount})
  }

  render() {

    return <div className='pay-method-body'>

      <div className='pay-method-body-header'>
        <span>Tarjeta</span>
      </div>

      <div className='pay-method-body-content'>

        <div className='pay-tag left'>MONTO:</div>
        <input value={this.props.cardAmount} onChange={this.payCardAmountChanged.bind(this)} 
        type='Number' className='form-control' disabled={this.props.is_closed}/>

        <div className='pay-tag left'>4 DIGITOS:</div>
        <input value={this.props.cardDigits} onChange={this.payCardDigitsChanged.bind(this)} 
        type='Number' className='form-control' disabled={this.props.is_closed}/>

        <div className='pay-tag left'>AUTORIZACIÓN:</div>
        <input value={this.props.cardAuth} onChange={this.payCardAuthChanged.bind(this)} 
        type='Number' className='form-control' disabled={this.props.is_closed}/>

        <br />
        <br />

      </div>

    </div>

  }

}
