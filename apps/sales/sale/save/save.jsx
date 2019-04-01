import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
import {loadSaleToReprint} from '../../../../general/reprintInvoice/actions.js'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    cart: store.cart,
    payMethod: store.pay.payMethod,
    payObject: store.pay.payObject,
    client: store.clients.clientSelected.client,
    user: store.user.user,
    debt: store.clients.clientSelectedDebt,
    warehouse_id: store.userProfile.salesWarehouse,
    warehouse2_id: store.config.workshopWarehouse,
    warehouse3_id: store.userProfile.reservesWarehouse,
    presaleId: store.presales.presaleId,
    nsreserveId: store.nsreserves.nsreserveId,
    workOrderId: store.workOrders.workOrderId,
    reserveId: store.reserves.reserveId,
    workOrder: store.workOrders.workOrderActive,
    exemptionData: store.taxExemption.exemptionData,
    isExempt: store.taxExemption.isExempt,
    extras: store.extras,
    isinvoice: store.sale.isInvoice,
    currency: store.currency.currencySelected,
    exchange: store.currency.exchangeRateSelected,
    marker: store.sale.saleUUID,
    conf: store.config.globalConf
    // sales: store.sales.sales,
    // saleId: store.sales.saleActiveId,
    // sale: store.sales.saleActive,
    // movements: store.clientmovements.movements
  }
})
export default class SaveBtn extends React.Component {

  saveBtn() {
    // const sales = this.props.sales
    // const user = this.props.user
    // CHECK IF IS WORKSHOP OR NOT
    document.getElementById('saveSaleButton').blur()
    const isinvoice = this.props.isinvoice == 'FACTURA'
    console.log('IS INVOICEEE', isinvoice)
    // DETERMIN THE WAREHOUSE WHERE THE PRODUCTS ARE SUBSTRACTED

    const warehouse = this.props.workOrderId.length // IF ITS WORKSHOP
      ? this.props.warehouse2_id
      : this.props.reserveId.length || this.props.nsreserveId.length // IF ITS RESERVE OR NS RESERVE
        ? this.props.warehouse3_id
        : this.props.warehouse_id // REGULAR PRESALE

    // ADD WORKSHOP ITEMS TO CART
    const cart = this.props.cart
    const exemptionData = this.props.exemptionData
    // the tax Amout for exemption is th exemption total
    exemptionData['exemptAmount'] = cart['cartExemptAmount']
    exemptionData['isExempt'] = this.props.isExempt

    cart['work_order_id'] = this.props.workOrderId
    cart['work_order'] = JSON.stringify(this.props.workOrder)
    cart['exemption_data'] = exemptionData
    // SALE
    const sale = {
      cart: JSON.stringify(cart),
      client: JSON.stringify(this.props.client),
      user: JSON.stringify(this.props.user),
      pay: JSON.stringify(this.props.payObject),
      extras: JSON.stringify(this.props.extras),
      client_id: this.props.client.id,
      warehouse_id: warehouse,
      presale_id: this.props.presaleId,
      isinvoice: isinvoice,
      currency_code: this.props.currency,
      exchange_rate: this.props.exchange,
      marker: this.props.marker
    }

    console.log('SALE', sale)

    const kwargs = {
      url: '/api/sales/',
      item: sale,
      sucessMessage: 'Venta creada correctamente'
    }

    const _this = this

    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveItem(kwargs, resolve, reject))
    })
    // SAVE PROCESS
    updatePromise.then((data) => {
      Mousetrap.reset()
      const __this = _this
      this.props.dispatch({type: 'HIDE_PAY_PANEL', payload: ''})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      this.props.dispatch(loadSaleToReprint(data.sale.consecutive, true, __this.props.conf.NoF5AfterSendOrPrint))
      this.props.dispatch({type: 'SET_SALE', payload: data.sale})
      this.props.dispatch({type: 'PROCESS_COMPLETE', payload: ''})
    }).catch((err) => {
      console.log(err.response.data)
      if (err.response) {
        console.log(err.response.data)
        alertify.alert('Error', `Error al procesar la Venta, ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
      } else {
        console.log('NO CUSTOM ERROR')
        console.log(err)
        alertify.alert('Error', `Error al procesar la Venta, ERROR: ${err}.`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })

  }

  render() {

    // return <div onClick={this.saveBtn.bind(this)} className={this.props.payButtonClass} >
    //   Registrar
    //   <i className='fa fa-credit-card' aria-hidden='true' />
    // </div>

    return <button disabled={this.props.disableSave} id='saveSaleButton' onClick={this.saveBtn.bind(this)} className={this.props.payButtonClass}>
      Registrar
      <i className='fa fa-credit-card' aria-hidden='true' />
    </button>

  }

}
