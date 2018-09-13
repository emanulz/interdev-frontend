import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from '../../../../../utils/api'
import {connect} from 'react-redux'
import SaveBtn from '../../save/save.jsx'
const Mousetrap = require('mousetrap')

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
    isInvoice: store.sale.isInvoice
    // sales: store.sales.sales,
    // saleId: store.sales.saleActiveId,
    // sale: store.sales.saleActive,
    // movements: store.clientmovements.movements
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

  saveBtn() {
    // const sales = this.props.sales
    const user = this.props.user
    const sale = {
      cart: JSON.stringify(this.props.cart),
      client: JSON.stringify(this.props.client),
      user: JSON.stringify(this.props.user),
      pay: JSON.stringify(this.props.pay)
    }

    if (this.props.pay.payMethod == 'CREDIT') {
      sale.pay.debt = this.props.cart.cartTotal
      sale.pay.payed = false
    }

    const kwargs = {
      url: '/api/sales/',
      item: sale,
      logCode: 'SALE_CREATE',
      logDescription: 'Creación de nueva Venta',
      logModel: 'SALE',
      user: user,
      itemOld: '',
      sucessMessage: 'Venta creada Correctamente.',
      errorMessage: 'Hubo un error al crear la Venta, intente de nuevo.',
      dispatchType: 'CLEAR_SALE',
      isSale: true
    }

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(saveItem(kwargs))
    this.props.dispatch({type: 'HIDE_PAY_PANEL', payload: ''})

    Mousetrap.reset()

  }

  getCashTag() {
    const cash = parseFloat(this.props.pay.payObject.cash[0].amount)
    if (cash > 0) {
      return <div>
        <div className='pay-tag left'>EFECTIVO :</div>
        <div className='pay-tag right'>
          ₡ {cash.formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  getCashAdvancesTag() {
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
          ₡ -{cashAdvancesAmount.formatMoney(2, ',', '.')}
        </div>
        <div className='pay-tag left'>POR PAGAR :</div>
        <div className='pay-tag right'>
          ₡ {(total - cashAdvancesAmount).formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  getCardTag() {
    const card = parseFloat(this.props.pay.payObject.card[0].amount)
    if (card > 0) {
      return <div>
        <div className='pay-tag left'>TARJETA :</div>
        <div className='pay-tag right'>
          ₡ {card.formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  getTransferTag() {
    const tran = parseFloat(this.props.pay.payObject.tran[0].amount)
    if (tran > 0) {
      return <div>
        <div className='pay-tag left'>TRANSFER :</div>
        <div className='pay-tag right'>
          ₡ {tran.formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  getCreditTag() {
    const credit = parseFloat(this.props.pay.payObject.cred[0].amount)
    if (credit > 0) {
      return <div>
        <div className='pay-tag left'>CRÉDITO :</div>
        <div className='pay-tag right'>
          ₡ {credit.formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  getVochersTag() {
    let total = 0
    for (const item in this.props.pay.payObject.vouc) {
      total += this.props.pay.payObject.vouc[item].amount
    }
    if (total > 0) {
      return <div>
        <div className='pay-tag left'>VALES :</div>
        <div className='pay-tag right'>
          ₡ {total.formatMoney(2, ',', '.')}
        </div>
      </div>
    }
    return <div />
  }

  setTicketOrInvoice(ev) {
    const val = ev.target.value
    this.props.dispatch({type: 'SET_IS_INVOICE_VALUE', payload: val})
  }

  render() {

    let change = 0
    let payButtonClass = 'pay-tag tag-button enable'
    const total = parseFloat(this.props.cart.cartTotal)

    const cashTag = this.getCashTag()
    const creditTag = this.getCreditTag()
    const cardTag = this.getCardTag()
    const transferTag = this.getTransferTag()
    const cashAdvancesTag = this.getCashAdvancesTag()
    const vouchersTag = this.getVochersTag()

    const totalInPay = this.calcTotalInPay()

    change = totalInPay - total
    payButtonClass = (total > 0 && change >= -0.1)
      ? 'pay-tag tag-button enable'
      : 'pay-tag tag-button'
    const eDocumentSelectClass = this.props.profile.taxPayer.is_digital_invoicing_active ? 'edocument-visible' : 'edocument-hidden'
    // switch (this.props.payMethod) {

    //   case 'CASH':
    //   {
    //     change = totalInPay - total
    //     payButtonClass = (total > 0 && change >= -0.1)
    //       ? 'pay-tag tag-button enable'
    //       : 'pay-tag tag-button'
    //     break
    //   }

    //   case 'CARD':
    //   {
    //     const auth = this.props.pay.cardAuth
    //     const digits = this.props.pay.cardDigits
    //     change = totalInPay - total
    //     payButtonClass = (total > 0 && change >= -0.1)
    //       ? 'pay-tag tag-button enable'
    //       : 'pay-tag tag-button'
    //     break
    //   }
    //   case 'CRED':
    //   {
    //     change = totalInPay - total
    //     const available = parseFloat(this.props.client.credit_limit) - parseFloat(this.props.debt)
    //     payButtonClass = (total > 0 && total <= available && this.props.client.has_credit)
    //       ? 'pay-tag tag-button enable'
    //       : 'pay-tag tag-button'
    //     break
    //   }

    // }

    return <div className='pay-side-bar'>
      <div className='pay-method-body-header'>
        <span>Pago</span>
      </div>

      <div className='pay-method-body-content'>

        <div className='pay-tag left'>
          TOTAL VENTA :</div>
        <div className='pay-tag right'>
          ₡ {this.props.cart.cartTotal.formatMoney(2, ',', '.')}</div>

        {cashTag}
        {cardTag}
        {creditTag}
        {vouchersTag}
        {transferTag}
        {cashAdvancesTag}

        <div className='pay-tag left'>TOTAL PAGO :</div>
        <div className='pay-tag right'>
          ₡ {totalInPay.formatMoney(2, ',', '.')}</div>

        <div className='pay-tag left'>VUELTO :</div>
        <div className='pay-tag right'>
          ₡ {change.formatMoney(2, ',', '.')}</div>

        <br />
        <div className={`edocument-type ${eDocumentSelectClass}`}>
          <div className='pay-tag left'>TIPO COMP :</div>
          <div className='pay-dropdown right'>
            <select value={this.props.isInvoice} onChange={this.setTicketOrInvoice.bind(this)}>
              <option value='TIQUETE'>Tiquete Electrónico</option>
              <option value='FACTURA'>Factura Electrónica</option>
            </select>
          </div>
        </div>
        <br />
        <SaveBtn payButtonClass={payButtonClass} />

      </div>

    </div>

  }

}
