import React from 'react'
// import {saveItem, loadSale} from '../actions'
import {connect} from 'react-redux'
import SaveBtn from '../../save/save.jsx'

@connect((store) => {
  return {
    cart: store.cart,
    client: store.clients.clientSelected.client,
    user: store.send.user,
    currencySymbol: store.currency.symbolSelected,
    presaleType: store.send.presale_type,
    advanceAmount: store.send.advance_amount
  }
})
export default class PaySideBar extends React.Component {

  updateAdvanceAmount(ev) {
    const value = ev.target.value
    this.props.dispatch({type: 'SET_ADVANCE_AMOUNT', payload: value})
  }

  render() {
    const symbol = this.props.currencySymbol
    let sendButtonClass = 'send-tag tag-button'
    const total = parseFloat(this.props.cart.cartTotal)
    const client = this.props.client
    const clientName = client.name && client.last_name ? `${client.name} ${client.last_name}` : 'Predeterminado'

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

    return <div className='send-side-bar'>
      <div className='send-method-body-header'>
        <span>Resumen</span>
      </div>

      <div className='send-method-body-content'>
        {advanceRow}
        <div className='send-tag left'>
          TOTAL :</div>
        <div className='send-tag right'>
          {symbol} {this.props.cart.cartTotal.formatMoney(2, ',', '.')}</div>

        <div className='send-tag left'>CLIENTE :</div>
        <div className='send-tag right'>
          {clientName}</div>
        <br />

        <SaveBtn disabledSend={disabledSend} sendButtonClass={sendButtonClass} />

      </div>

    </div>

  }

}
