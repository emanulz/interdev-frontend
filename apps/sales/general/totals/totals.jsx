/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import {recalcCart} from '../../general/product/actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    total: store.cart.cartTotal,
    totalNotRounded: store.cart.totalNotRounded,
    client: store.clients.clientSelected.client,
    taxes: store.cart.cartTaxes,
    discountTotal: store.cart.discountTotal,
    subTotalNoDiscount: store.cart.cartSubtotalNoDiscount,
    itemsInCart: store.cart.cartItems,
    globalDiscount: store.cart.globalDiscount,
    isExempt: store.cart.isExempt,
    exemptAmount: store.cart.cartExemptAmount,
    currencySymbol: store.currency.symbolSelected,
    otherChargesTotal: store.cart.otherChargesTotal
    // disabled: store.sales.completed
  }
})
export default class Totals extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      discountVal: 0
    }
  }

  showInvoicePanel() {
    this.props.dispatch({type: 'SHOW_INVOICE_PANEL', payload: -1})
  }

  inputKeyPress(ev) {
    // if Key pressed id Enter
    if (ev.key == 'Enter') {

      const discount = (ev.target.value)
        ? ev.target.value
        : 0
      // CALC THE MAX DISCOUNT AND CHECKS IT ON FIELD
      const maxDiscount = this.props.client.maxDiscount ? this.props.client.maxDiscount : 100
      if (discount <= maxDiscount) {
        this.props.dispatch({type: 'SET_GLOBAL_DISCOUNT', payload: discount})
        this.props.dispatch(recalcCart(this.props.itemsInCart, this.state.discountVal, this.props.client))
      } else {
        alertify.alert('Error', `El descuento para el cliente seleccionado no puede ser mayor al ${maxDiscount}%`)
        document.getElementById('discountField').value = parseFloat(this.props.globalDiscount)
      }
    } else {
      this.state.discountVal = (ev.target.value)
        ? parseFloat(ev.target.value)
        : 0
    }

  }

  inputOnBlur(ev) {
    // if Key pressed id Enter

    const discount = (ev.target.value)
      ? ev.target.value
      : 0
    // CALC THE MAX DISCOUNT AND CHECKS IT ON FIELD
    const maxDiscount = this.props.client.maxDiscount ? this.props.client.maxDiscount : 100
    if (discount <= maxDiscount) {
      this.props.dispatch({type: 'SET_GLOBAL_DISCOUNT', payload: discount})
      this.props.dispatch(recalcCart(this.props.itemsInCart, this.state.discountVal, this.props.client))
    } else {
      alertify.alert('Error', `El descuento para el cliente seleccionado no puede ser mayor al ${maxDiscount}%`)
      document.getElementById('discountField').value = parseFloat(this.props.globalDiscount)
    }

  }

  // Main Layout
  render() {

    const symbol = this.props.currencySymbol

    const ExemptTotal = this.props.isExempt
      ? <tr>
        <th>IV Exonerado:</th>
        <td className='price'>{symbol} {this.props.exemptAmount.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />
    const otherChargesTotal = this.props.otherChargesTotal
    const otherCargesRow = otherChargesTotal
      ? <tr>
        <th>Servicio 10%:</th>
        <td className='price'>{symbol} {otherChargesTotal.formatMoney(2, ',', '.')}</td>
      </tr>
      : <tr />
    return <div className='totals'>
      <div style={{
        'paddingTop': '0',
        'marginTop': '0'
      }} className='bg-white right-item'>
        {/* <span>
          <b>Totales:</b>
        </span><br /> */}
        <table className='table totals-table'>
          <tbody>
            <tr>
              <th>Sub-Total:</th>
              <td className='price'>{symbol} {this.props.subTotalNoDiscount.formatMoney(2, ',', '.')}</td>

            </tr>
            <tr>
              <th>Descuento:</th>
              <td className='price'>{symbol} {this.props.discountTotal.formatMoney(2, ',', '.')}</td>

            </tr>

            <tr>
              <th>IV:</th>
              <td className='price'>{symbol} {this.props.taxes.formatMoney(2, ',', '.')}</td>
            </tr>
            {ExemptTotal}
            {otherCargesRow}
            <tr>
              {/* <th onClick={this.showInvoicePanel.bind(this)}>Total:</th> */}
              <th>Total:</th>
              <td className='price'>{symbol} {this.props.total.formatMoney(2, ',', '.')}</td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>

  }

}
