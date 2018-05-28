import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from '../../../../../utils/api'
import {connect} from 'react-redux'
//import SaveBtn from '../../save/save.jsx'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    cart: store.cart,
    payMethod: store.pay.payMethod,
    pay: store.pay,
  }
})
export default class PaySideBar extends React.Component {

 /*
  saveBtn() {
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
 */

  render() {

    let credit = 0
    let payButtonClass = 'pay-tag tag-button'
    const total = parseFloat(this.props.cart.cartTotal)
    const cash = parseFloat(this.props.pay.cashAmount)
    const card = parseFloat(this.props.pay.cardAmount)

     switch (this.props.payMethod) {

      case 'CASH':
      {
        credit = total - cash
        break
      }

      case 'CARD':
      {
        credit = total - card
        break
      }
      case 'CRED':
      {
        credit = total
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

        <div className='pay-tag left'>CRÉDITO :</div>
        <div className='pay-tag right'>
          ₡ {credit.formatMoney(2, ',', '.')}</div>

        <br />

      </div>

    </div>

  }

}
