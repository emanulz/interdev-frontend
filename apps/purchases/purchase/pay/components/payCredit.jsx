import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {client: store.purchase_clients.clientSelected, 
    debt: store.purchase_clients.clientSelectedDebt, 
    creditDays: store.pay.creditDays,
    isEdit: store.purchase.is_closed,
  }
})
export default class PayCredit extends React.Component {

  creditDaysChanged(e){
    const days = parseFloat(e.target.value)? parseFloat(e.target.value):-1
    if(days==-1){return}
    this.props.dispatch({type:'UPDATE_CREDIT_DAYS', payload:days})
  }


  render() {

    return <div className='pay-method-body'>

      <div className='pay-method-body-header'>
        <span>Crédito</span>
      </div>

      <div className='pay-method-body-content'>

        <div className='pay-tag left'>PLAZO:</div>
        <input value={this.props.creditDays} onChange={this.creditDaysChanged.bind(this)} 
        type='number' className='form-control' disabled={this.props.is_closed}/>

        <br />
        <br />

      </div>

    </div>

  }

}
