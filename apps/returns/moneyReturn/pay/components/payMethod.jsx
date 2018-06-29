import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {payMethod: store.pay.payMethodActive}
})
export default class PayMethod extends React.Component {

  clickChangePayMethod(method, ev) {

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

      {/* onClick={this.clickChangePayMethod.bind(this, 'CREDIT')} */}
      <div onClick={this.clickChangePayMethod.bind(this, 'CRED')} className={(this.props.payMethod == 'CRED'
        ? 'pay-method-select-item selected'
        : 'pay-method-select-item')}>

        <div className='pay-method-select-item-header'>
          <span>Crédito</span>
        </div>

        <i className='fa fa-users' aria-hidden='true' />

      </div>

      {/* onClick={this.clickChangePayMethod.bind(this, 'OTHER')} */}
      <div onClick={this.clickChangePayMethod.bind(this, 'VOUC')} className={(this.props.payMethod == 'VOUC'
        ? 'pay-method-select-item selected'
        : 'pay-method-select-item')}>

        <div className='pay-method-select-item-header'>
          <span>Vale</span>
        </div>

        <i className='fa fa-file-text-o' aria-hidden='true' />

      </div>

      <div onClick={this.clickChangePayMethod.bind(this, 'TRAN')} className={(this.props.payMethod == 'TRAN'
        ? 'pay-method-select-item selected'
        : 'pay-method-select-item')}>

        <div className='pay-method-select-item-header'>
          <span>Transfer</span>
        </div>

        <i className='fa fa-exchange' aria-hidden='true' />

      </div>

    </div>

  }

}
