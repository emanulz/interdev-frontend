import React from 'react'
import { connect } from 'react-redux'
import {formatDate} from '../../../../../utils/formatDate.js'
import {updateStoreVoucherAmount, addToExtraVoucher} from '../actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    client: store.clients.clientSelected,
    cashAmount: store.pay.payObject.cash[0].amount,
    cartTotal: store.cart.cartTotal,
    payObject: store.pay.payObject,
    isCredit: store.pay.isCredit,
    extraVouchers: store.pay.extraVouchers
  }
})
export default class PayOther extends React.Component {

  // addToVouchArray(amount, id, ev) {

  //   const checked = ev.target.checked
  //   const payload = {
  //     voucherNumber: id,
  //     amount: parseFloat(amount),
  //     type: 'VOUC'
  //   }
  //   if (checked) {
  //     this.props.dispatch({type: 'ADD_TO_VOUCHER_ARRAY', payload: payload})
  //   } else {
  //     this.props.dispatch({type: 'REMOVE_FROM_VOUCHER_ARRAY', payload: payload})
  //   }
  // }
  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_PAY_OBJECT_MANTAIN_METHOD', payload: ''})
  }
  addVoucherToExtra() {
    const _this = this
    alertify.prompt('Usar Vale Existente', 'Ingrese el número de vale a utilizar', ''
      , function(evt, value) {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(addToExtraVoucher(value))
      }
      , function() { })
  }

  voucherSelectedAmountChanged(amount, id, ev) {
    // THIS FUNCTION WILL UPDATE THE CASH AMOUNT AND AUTOUPDATE THE CREDIT AMOUNT
    const checked = ev.target.checked
    this.props.dispatch(updateStoreVoucherAmount(
      checked,
      id,
      amount,
      this.props.cartTotal,
      this.props.client,
      this.props.payObject,
      this.props.dispatch,
      this.props.isCredit
    ))
  }

  render() {
    const client = this.props.client
    const vouchers = client.client.code != '00' ? client.credit_vouchers : []
    const extraVouchers = this.props.extraVouchers
    extraVouchers.map(vouch => {
      const index = vouchers.find(voucher => voucher.id == vouch.id)
      // alertify.alert('INDEX', index)
      if (!index) {
        vouchers.push(vouch)
      }
    })
    const voucherItems = vouchers.length
      ? vouchers.map(voucher => {
        const clientInsideVoucher = JSON.parse(voucher.client)
        const inList = this.props.payObject.vouc.find(element => element.id == voucher.id)
        console.log('INNN LISTTT', inList)
        return <div className='voucher-item' key={voucher.id}>
          <div className='voucher-item-consecutive'>
            {voucher.consecutive}
          </div>
          <div className='voucher-item-date'>
            {formatDate(voucher.created)}
          </div>
          <div className='voucher-item-client'>
            {`${clientInsideVoucher.name} ${clientInsideVoucher.last_name}`}
          </div>
          <div className='voucher-item-amount'>
            ₡ {parseFloat(voucher.amount).formatMoney(2, ',', '.')}
          </div>
          <div className='voucher-item-checkbox'>
            <input type='checkbox' checked={inList} onChange={this.voucherSelectedAmountChanged.bind(this, voucher.amount, voucher.id)} />
          </div>
        </div>

      })
      : <div className='voucher-item'>
        NO HAY VALES DISPONIBLES
      </div>
    return <div className='pay-method-body'>

      <div className='pay-method-body-header'> <span>Vale</span> <i className='fa fa-download add-voucher-btn' onClick={this.addVoucherToExtra.bind(this)} /> </div>
      <div className='pay-method-body-content'>
        <div className='voucher-header'>
          <div className='voucher-header-consecutive'>
            Consec
          </div>
          <div className='voucher-header-date'>
            Fecha
          </div>
          <div className='voucher-header-client'>
            Cliente
          </div>
          <div className='voucher-header-amount'>
            Monto
          </div>
          <div className='voucher-header-checkbox'>
            Usar
          </div>
        </div>

        {voucherItems}

        <br />
        <br />
      </div>

    </div>
  }
}
