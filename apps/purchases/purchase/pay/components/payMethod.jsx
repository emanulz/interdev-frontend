import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {payMethod: store.pay.payMethod, is_closed: store.purchase.is_closed}
})
export default class PayMethod extends React.Component {

  clickChangePayMethod(method, ev) {
    if(this.props.is_closed){
      this.props.dispatch({type:'CHANGE_METHOD_DISABLED'})
      return
    }
    this.props.dispatch({type: 'CHANGE_PAY_METHOD', payload: method})

  }

  render() {

    return <div className='pay-method-select'>

      <div onClick={this.clickChangePayMethod.bind(this, 'CASH')} className={(this.props.payMethod == 'CASH'
        ? 'pay-method-select-item selected'
        : 'pay-method-select-item')}>

        <div className='pay-method-select-item-header'>
          <span>Efectivo</span>
        </div>

        <i className='fa fa-money' aria-hidden='true' />

      </div>

      <div onClick={this.clickChangePayMethod.bind(this, 'CARD')} className={(this.props.payMethod == 'CARD'
        ? 'pay-method-select-item selected'
        : 'pay-method-select-item')}>

        <div className='pay-method-select-item-header'>
          <span>Tarjeta</span>
        </div>

        <i className='fa fa-credit-card' aria-hidden='true' />

      </div>

      <div onClick={this.clickChangePayMethod.bind(this, 'CRED')} className={(this.props.payMethod == 'CRED'
        ? 'pay-method-select-item selected'
        : 'pay-method-select-item')}>

        <div className='pay-method-select-item-header'>
          <span>Crédito</span>
        </div>

        <i className='fa fa-users' aria-hidden='true' />

      </div>

      {/* onClick={this.clickChangePayMethod.bind(this, 'OTHER')} */}
      {/*
      <div className={(this.props.payMethod == 'OTHE'
        ? 'pay-method-select-item selected'
        : 'pay-method-select-item')}>

        <div className='pay-method-select-item-header'>
          <span>Otro</span>
        </div>

        <i className='fa fa-share' aria-hidden='true' />

      </div>
      */}
    </div>

  }

}
