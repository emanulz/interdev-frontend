import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    cart: store.cart,
    payMethod: store.pay.payMethod,
    payObject: store.pay.payObject,
    client: store.clients.clientSelected.client,
    user: store.user.user,
    debt: store.clients.clientSelectedDebt,
    warehouse_id: store.config.salesWarehouse,
    warehouse2_id: store.config.workshopWarehouse,
    warehouse3_id: store.config.reservesWarehouse,
    presaleId: store.presales.presaleId,
    workOrderId: store.workOrders.workOrderId,
    reserveId: store.reserves.reserveId,
    workOrder: store.workOrders.workOrderActive,
    exemptionData: store.taxExemption.exemptionData,
    extras: store.extras
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
    const warehouse = this.props.workOrderId.length ? this.props.warehouse2_id : this.props.reserveId.length ? this.props.warehouse3_id : this.props.warehouse_id
    // ADD WORKSHOP ITEMS TO CART
    const cart = this.props.cart
    const exemptionData = this.props.exemptionData
    // the tax Amout for exemption is th exemption total
    exemptionData['exemptAmount'] = cart['cartExemptAmount']

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
      presale_id: this.props.presaleId
    }

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
      this.props.dispatch({type: 'HIDE_PAY_PANEL', payload: ''})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      this.props.dispatch({type: 'SHOW_INVOICE_PANEL', payload: ''})
      this.props.dispatch({type: 'SET_SALE', payload: data})
      this.props.dispatch({type: 'PROCESS_COMPLETE', payload: ''})
      Mousetrap.reset()
    }).catch((err) => {
      console.log(err.response.data)
      if (err.response) {
        alertify.alert('ERROR', `${err.response.data[Object.keys(err.response.data)[0]]}`)
      } else {
        alertify.alert('ERROR', `Hubo un error al guardar la venta, error: ${err}`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })

  }

  render() {

    return <div onClick={this.saveBtn.bind(this)} className={this.props.payButtonClass}>
      Registrar
      <i className='fa fa-credit-card' aria-hidden='true' />
    </div>

  }

}
