import React from 'react'

import {connect} from 'react-redux'
import SaveBtn from '../../save/save.jsx'

@connect((store) => {
  return {
    cart: store.cart,
    payMethod: store.pay.payMethodActive,
    pay: store.pay,
    payObject: store.pay.payObject,
    client: store.clients.clientSelected.client,
    user: store.clients.userSelected,
    debt: store.clients.clientSelectedDebt,
    isCredit: store.pay.isCredit,
    profile: store.userProfile,
    isInvoice: store.sale.isInvoice,
    currencySymbol: store.currency.symbolSelected,
    selected_activity: store.sale.selected_activity

  }
})
export default class PaySideBar extends React.Component {
  calcTotalInPay () {
    const payObject = this.props.payObject
    let total = 0
    for (const item in payObject) {
      let innerAmount = 0
      for (const innerItem in payObject[item]) {
        innerAmount += payObject[item][innerItem].amount
      }
      total += innerAmount
    }
    return total
  }

  getCashTag(symbol) {
    const cash = parseFloat(this.props.pay.payObject.cash[0].amount)
    if (cash > 0) {
      return <div>
        <div className='pay-tag left'>EFECTIVO :</div>
        <div className='pay-tag right'>
          {symbol} {cash.formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  getCashAdvancesTag(symbol) {
    const total = parseFloat(this.props.cart.cartTotal)
    const cashAdvances = this.props.pay.payObject.csha
    let cashAdvancesAmount = 0
    for (const item in cashAdvances) {
      cashAdvancesAmount += cashAdvances[item].amount
    }
    if (cashAdvancesAmount > 0) {
      return <div>
        <div className='pay-tag left'>ADELANTOS :</div>
        <div className='pay-tag right'>
          {symbol} -{cashAdvancesAmount.formatMoney(2, ',', '.')}
        </div>
        <div className='pay-tag left'>POR PAGAR :</div>
        <div className='pay-tag right'>
          {symbol} {(total - cashAdvancesAmount).formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  getCardTag(symbol) {
    const card = parseFloat(this.props.pay.payObject.card[0].amount)
    if (card > 0) {
      return <div>
        <div className='pay-tag left'>TARJETA :</div>
        <div className='pay-tag right'>
          {symbol} {card.formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  getTransferTag(symbol) {
    const tran = parseFloat(this.props.pay.payObject.tran[0].amount)
    if (tran > 0) {
      return <div>
        <div className='pay-tag left'>TRANSFER :</div>
        <div className='pay-tag right'>
          {symbol} {tran.formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  getCreditTag(symbol) {
    const credit = parseFloat(this.props.pay.payObject.cred[0].amount)
    if (credit > 0) {
      return <div>
        <div className='pay-tag left'>CRÉDITO :</div>
        <div className='pay-tag right'>
          {symbol} {credit.formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  getVochersTag(symbol) {
    let total = 0
    for (const item in this.props.pay.payObject.vouc) {
      total += this.props.pay.payObject.vouc[item].amount
    }
    if (total > 0) {
      return <div>
        <div className='pay-tag left'>VALES :</div>
        <div className='pay-tag right'>
          {symbol} {total.formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  setTicketOrInvoice(ev) {
    const val = ev.target.value
    this.props.dispatch({type: 'SET_IS_INVOICE_VALUE', payload: val})
  }

  setSelectedActivity(ev){
    const val = ev.target.value;
    this.props.dispatch({type: 'SET_DOC_ACTIVITY', payload: val})
  }

  saveOnFocus() {
    // console.log('FOCUSSSS')
  }

  render() {
    const symbol = this.props.currencySymbol
    let change = 0
    let payButtonClass = 'pay-tag tag-button enable'
    const total = parseFloat(this.props.cart.cartTotal)

    const cashTag = this.getCashTag(symbol)
    const creditTag = this.getCreditTag(symbol)
    const cardTag = this.getCardTag(symbol)
    const transferTag = this.getTransferTag(symbol)
    const cashAdvancesTag = this.getCashAdvancesTag(symbol)
    const vouchersTag = this.getVochersTag(symbol)

    const totalInPay = this.calcTotalInPay(symbol)

    change = totalInPay - total
    payButtonClass = (total > 0 && change >= -0.1)
      ? 'pay-tag tag-button enable'
      : 'pay-tag tag-button'
    const disabledSave = !(total > 0 && change >= -0.1)
    const eDocumentSelectClass = this.props.profile.taxPayer.is_digital_invoicing_active ? 'edocument-visible' : 'edocument-hidden'
 
    //get possible activities from the tp local
    let activities_raw = this.props.profile.activeLocal.tax_activities ? this.props.profile.activeLocal.tax_activities : ''
    activities_raw = activities_raw.split(',')

    let activities_data = []
    for(let raw of activities_raw){
      const bits = raw.split('_')
      if(bits.length === 2){
        activities_data.push(<option key={bits[0]} value={ bits[0] }>{ bits[0] + bits[1] }</option>)
      }else{
        activities_data.push(activities_data.push(<option key={bits[0]} value={ bits[0] }>{ bits[0] }</option>))
      }
    }

    let activities_component = ''
    if(activities_data.length>1){
      activities_component = <div className={`edocument-type ${eDocumentSelectClass}`}>
        <div className='pay-tag left'>ACTIVIDAD :</div>
        <div className='pay-dropdown right'>
          <select value={this.props.selected_activity} onChange={this.setSelectedActivity.bind(this)}>
            {activities_data}
          </select>
        </div>
      </div>
    }


    return <div className='pay-side-bar'>
      <div className='pay-method-body-header'>
        <span>Pago</span>
      </div>

      <div className='pay-method-body-content'>

        <div className='pay-tag left'>
          TOTAL VENTA :</div>
        <div className='pay-tag right'>
          {symbol} {this.props.cart.cartTotal.formatMoney(2, ',', '.')}</div>

        {cashTag}
        {cardTag}
        {creditTag}
        {vouchersTag}
        {transferTag}
        {cashAdvancesTag}

        <div className='pay-tag left'>TOTAL PAGO :</div>
        <div className='pay-tag right'>
          {symbol} {totalInPay.formatMoney(2, ',', '.')}</div>

        <div className='pay-tag left'>VUELTO :</div>
        <div className='pay-tag right'>
          {symbol} {change.formatMoney(2, ',', '.')}</div>

        <br />
        <div className={`edocument-type ${eDocumentSelectClass}`}>
          <div className='pay-tag left'>TIPO COMP :</div>
          <div className='pay-dropdown right'>
            <select value={this.props.isInvoice} onChange={this.setTicketOrInvoice.bind(this)}>
              <option key='1' value='TIQUETE'>Tiquete Electrónico</option>
              <option key='2' value='FACTURA'>Factura Electrónica</option>
            </select>
          </div>
        </div>
        {activities_component}
        <br />
        <SaveBtn payButtonClass={payButtonClass} disableSave={disabledSave} />
        {/* <button id='register-sale-btn' onFocus={this.saveOnFocus.bind(this)}>TEST</button> */}

      </div>

    </div>

  }

}
