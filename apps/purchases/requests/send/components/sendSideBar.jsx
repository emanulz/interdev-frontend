import React from 'react'
// import {saveItem, loadSale} from '../actions'
import {connect} from 'react-redux'
import SaveBtn from '../../save/save.jsx'

@connect((store) => {
  return {
    cart: store.cart,
    supplier: store.suppliers.supplierSelected,
    user: store.send.user,
    currencySymbol: store.currency.symbolSelected,
    presaleType: store.send.presale_type,
    advanceAmount: store.send.advance_amount,
    payMethod: store.send.pay_method
  }
})
export default class PaySideBar extends React.Component {

  updateAdvanceAmount(ev) {
    const value = ev.target.value
    this.props.dispatch({type: 'SET_ADVANCE_AMOUNT', payload: value})
  }

  setPayMethod(ev) {
    this.props.dispatch({type: 'SET_SEND_PAY_METHOD', payload: ev.target.value})
  }

  render() {
    const symbol = this.props.currencySymbol
    let sendButtonClass = 'send-tag tag-button'
    const total = parseFloat(this.props.cart.cartTotal)
    const supplier = this.props.supplier
    const supplierName = supplier.name ? `${supplier.name}` : 'NO SELECCIONADO'

    sendButtonClass = (total > 0 && this.props.user.username)
      ? 'send-tag tag-button enable'
      : 'send-tag tag-button'
    const disabledSend = !(total > 0 && this.props.user.username)
    const advanceRow = this.props.presaleType == 'NS_RESERVE'
      ? <div className='send-side-bar-nsadvance'>
        <div className='send-side-bar-nsadvance-tag'>
          ADELANTO:
        </div>
        <input value={this.props.advanceAmount} onChange={this.updateAdvanceAmount.bind(this)} type='number' className='send-side-bar-nsadvance-input' />
      </div>
      : ''
    const payMethodRow = this.props.presaleType == 'NS_RESERVE'
      ? <div className='send-side-bar-nsadvance'>
        <div className='send-side-bar-nsadvance-tag'>
          PAGO:
        </div>
        <select onChange={this.setPayMethod.bind(this)} className='send-side-bar-nsadvance-input' name='pay_method'
          value={this.props.payMethod} >
          <option value='CASH'>EFECTIVO</option>
          <option value='CARD'>TARJETA</option>
          <option value='TRANSFER'>TRANSFERENCIA</option>
        </select>
      </div>
      : ''
    return <div className='send-side-bar'>
      <div className='send-method-body-header'>
        <span>Resumen</span>
      </div>

      <div className='send-method-body-content'>
        {advanceRow}
        {payMethodRow}
        <div className='send-tag left'>PROVEEDOR :</div>
        <div className='send-tag right'>
          {supplierName}</div>
        <br />

        <SaveBtn disabledSend={disabledSend} sendButtonClass={sendButtonClass} />

      </div>

    </div>

  }

}
