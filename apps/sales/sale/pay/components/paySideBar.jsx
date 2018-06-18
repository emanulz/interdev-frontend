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
    client: store.clients.clientSelected,
    user: store.clients.userSelected,
    debt: store.clients.clientSelectedDebt
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

  render() {

    let change = 0
    let payButtonClass = 'pay-tag tag-button enable'
    const total = parseFloat(this.props.cart.cartTotal)
    const cash = parseFloat(this.props.pay.payObject.cash[0].amount)
    const totalInPay = this.calcTotalInPay()

    switch (this.props.payMethod) {

      case 'CASH':
      {
        change = totalInPay - total
        payButtonClass = (total > 0 && change >= 0)
          ? 'pay-tag tag-button enable'
          : 'pay-tag tag-button'
        break
      }

      case 'CARD':
      {
        const auth = this.props.pay.cardAuth
        const digits = this.props.pay.cardDigits
        change = totalInPay - total
        payButtonClass = (total > 0 && auth && digits)
          ? 'pay-tag tag-button enable'
          : 'pay-tag tag-button'
        break
      }
      case 'CRED':
      {
        change = totalInPay - total
        const available = parseFloat(this.props.client.credit_limit) - parseFloat(this.props.debt)
        payButtonClass = (total > 0 && total <= available && this.props.client.has_credit)
          ? 'pay-tag tag-button enable'
          : 'pay-tag tag-button'
        break
      }

    }

    return <div className='pay-side-bar'>
      <div className='pay-method-body-header'>
        <span>Pago</span>
      </div>

      <div className='pay-method-body-content'>

        <div className='pay-tag left'>
          TOTAL :</div>
        <div className='pay-tag right'>
          ₡ {this.props.cart.cartTotal.formatMoney(2, ',', '.')}</div>

        <div className='pay-tag left'>VUELTO :</div>
        <div className='pay-tag right'>
          ₡ {change.formatMoney(2, ',', '.')}</div>

        <div className='pay-tag left'>TOTAL PAGO :</div>
        <div className='pay-tag right'>
          ₡ {totalInPay.formatMoney(2, ',', '.')}</div>

        <br />

        <SaveBtn payButtonClass='pay-tag tag-button enable' />

      </div>

    </div>

  }

}
