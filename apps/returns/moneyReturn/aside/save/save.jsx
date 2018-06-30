import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    cart: store.cart,
    client: store.clients.clientSelected,
    warehouse_id: store.config.salesWarehouse,
    warehouse2_id: store.config.workshopWarehouse,
    sale: store.sale.saleActive,
    returnItems: store.returnCart.returnItems
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
    const warehouse = this.props.sale.cart.work_order_id ? this.props.warehouse2_id : this.props.warehouse_id
    // SALE
    const saleId = this.props.sale.id
    const returnList = this.props.returnItems.map(item => {
      return {id: item.id, ret_qty: item.qty}
    })
    const returnItem = {
      'return_list': JSON.stringify(returnList),
      'return_method': 'VOUCHER',
      'destination_warehouse_id': warehouse
    }

    const kwargs = {
      url: `/api/sales/${saleId}/product_return/`,
      item: returnItem,
      sucessMessage: 'Devolución creada correctamente'
    }

    const _this = this

    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveItem(kwargs, resolve, reject))
    })
    // SAVE PROCESS
    updatePromise.then((data) => {
      alertify.alert('COMPLETETADO', 'PROCESO COMPLETO')
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(data)
    }).catch((err) => {
      console.log(err.response.data)
      if (err.response) {
        alertify.alert('ERROR', `${err.response.data[Object.keys(err.response.data)[0]]}`)
      } else {
        alertify.alert('ERROR', `Hubo un error al guardar la devolución, error: ${err}`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })

  }

  render() {

    return <div onClick={this.saveBtn.bind(this)} className='save-btn'>
      Registrar
      <i className='fa fa-credit-card' aria-hidden='true' />
    </div>

  }

}
