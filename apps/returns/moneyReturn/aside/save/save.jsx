import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
import {loadReturnToPrint} from '../../../../../general/printReturn/actions.js'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    cart: store.cart,
    client: store.clients.clientSelected,
    warehouse_id: store.config.salesWarehouse,
    warehouse2_id: store.config.workshopWarehouse,
    sale: store.sale.saleActive,
    returnItems: store.returnCart.returnItems,
    returnCart: store.returnCart
    // sales: store.sales.sales,
    // saleId: store.sales.saleActiveId,
    // sale: store.sales.saleActive,
    // movements: store.clientmovements.movements
  }
})
class SaveBtn extends React.Component {
  preSaveBtn() {
    const _this = this
    if (this.props.returnCart.returnTotal > 0) {
      alertify.confirm('CREAR', `Desea guardar la devolución y nota de crédito para la factura
      #${this.props.sale.consecutive}, por un monto de ₡${parseFloat(this.props.returnCart.returnTotal).formatMoney()}? Esta acción no se puede deshacer.`,
      function() {
        _this.saveBtn()
      }, function() {
        return true
      }).set('labels', {
        ok: 'Si',
        cancel: 'No'
      })
    } else {
      alertify.alert('ERROR', 'No se puede crear una nota de crédito con monto ₡ 0.00.')
    }

  }

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
      'return_method': 'CASH',
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
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      const returnObjectCreated = JSON.parse(data)
      _this.props.dispatch(loadReturnToPrint(returnObjectCreated.consecutive))
      // CLEAR ALL REDUCERS
      _this.props.dispatch({type: 'CLEAR_RETURN_ALL', payload: ''})
      _this.props.dispatch({type: 'CLEAR_SALE_ALL', payload: ''})
      _this.props.dispatch({type: 'SET_FULL_WIDTH', payload: ''})
      // NAVIGATE TO THE RETURNS PAGE
      _this.props.history.push('/returns')
    }).catch((err) => {
      console.log(err.response.data)
      if (err.response) {
        alertify.alert('ERROR', `Hubo un error al guardar la devolución, error: ${err.response.data}`)
      } else {
        alertify.alert('ERROR', `Hubo un error al guardar la devolución, error: ${err}`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })

  }

  render() {

    return <div onClick={this.preSaveBtn.bind(this)} className='save-btn'>
      <div>
        Registrar
        <i className='fa fa-credit-card' aria-hidden='true' />
      </div>
    </div>

  }

}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(SaveBtn)
