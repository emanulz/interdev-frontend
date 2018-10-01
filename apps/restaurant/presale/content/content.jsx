/*
 * Module dependencies
 */
import React from 'react'

import Product from '../../../sales/general/product/product.jsx'
import Cart from '../../../sales/general/cart/cart.jsx'
import {connect} from 'react-redux'
import {updatePresale} from './actions.js'
import alertify from 'alertifyjs'
import {loadPresaleItem} from '../actions.js'
import { withRouter } from 'react-router-dom'
import { setProduct, productSelected } from '../../../sales/general/product/actions.js'

@connect((store) => {
  return {
    fullWidth: store.presale.fullWidth,
    total: store.cart.cartTotal,
    cart: store.cart,
    client: store.clients.clientSelected.client,
    user: store.send.user,
    presaleType: store.send.presale_type,
    reserves_warehouse: store.config.reserves_warehouse,
    extras: store.extras,
    presaleActiveId: store.presale.presaleActiveId,
    warehouse_id: store.userProfile.salesWarehouse,
    config: store.config.globalConf,
    priceListSelected: store.priceList.listSelected,
    usePriceListAsDefault: store.priceList.useAsDefault
  }
})
class Content extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  closePresale() {
    // ALERTIFY CONFIRM
    const _this = this
    alertify.confirm('Cerrar Orden', `¿Desea Cerrar la orden y calcular la cuenta? Esta acción no se puede deshacer`, function() {
      _this.add10PercentToCart(true)
    }, function() {
      return true
    }).set('labels', {
      ok: 'Cerrar',
      cancel: 'Permanecer'
    })
  }

  calc10Percent(cart, table) {
    console.log(cart)
    // return parseFloat(cart.cartTotal) * 0.1
    return parseFloat(cart.subtotal) * 0.1
  }

  add10PercentToCart(close) {
    const _this = this
    const setProductPromise = new Promise((resolve, reject) => {
      const kwargs = {
        lookUpField: 'code',
        url: '/api/productslist/',
        lookUpValue: '000',
        lookUpName: 'código',
        modelName: 'Productos'
      }
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      setProduct(kwargs, resolve, reject)
    })
    setProductPromise.then((data) => {
      console.log('DATAA', data)
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      const product = data.results[0]
      product.price = _this.calc10Percent(_this.props.cart, 1)
      try {
        // _this.props.dispatch(
        //   productSelected(
        //     product.code,
        //     1,
        //     product,
        //     _this.props.cart.cartItems,
        //     0,
        //     _this.props.client,
        //     _this.props.warehouse_id)
        // )
        const percentData = {
          default_discount: '0',
          id: product.id,
          max_discount: '0',
          product: product,
          table_price: '0',
          target_price_list: 'price1'
        }
        this.props.dispatch(productSelected(percentData, 1, _this.props.cart.cartItems, _this.props.client,
          _this.props.warehouse_id, true, _this.props.priceListSelected, _this.props.usePriceListAsDefault))
        // AFTER ADDING THE 10 PERCENT CLOSE ORDER
        this.savePresale(close)
      } catch (err) {
        console.log(err)
      }
    }).catch((err) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
    })

  }

  savePresale(close) {

    const presale = {
      cart: JSON.stringify(this.props.cart),
      client_id: this.props.client.id,
      extras: JSON.stringify(this.props.extras)
    }

    const kwargs = {
      url: `/api/presales/${this.props.presaleActiveId}/`,
      item: {presale: presale, closePresale: close}
    }

    const _this = this

    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(updatePresale(kwargs, resolve, reject))
    })

    updatePromise.then((data) => {
      console.log(data)
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('Completado', 'Orden Actualizada Correctamente')
      loadPresaleItem(data.id, _this.props.dispatch)
    }).catch((err) => {
      console.log(err)
      _this.props.dispatch({type: 'FETCHING_DONE'})
      alertify.alert('ERROR', 'Error al actualizar la orden')
    })

  }

  goToTableBillList() {
    const lookUp = this.props.location.pathname.split('/')
    const table = lookUp[lookUp.length - 2]
    this.props.history.push(`/restaurant/tables/${table}`)
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'sale-content fullWidth' : 'sale-content'
    const cartClass = this.props.fullWidth ? 'sale-content-cart' : 'sale-content-cart fullHeight'
    const totalClass = this.props.fullWidth ? 'sale-content-total' : 'sale-content-total collapsed'
    const buttonsClass = this.props.fullWidth ? 'sale-content-buttons' : 'sale-content-buttons collapsed'

    return <div className={contentClass}>
      <div className={buttonsClass} >
        <button onClick={this.goToTableBillList.bind(this)} className='btn btn-primary' >
          <i className='fa fa-chevron-left' />
          Lista de Cuentas
        </button>
        <button onClick={this.closePresale.bind(this)} className='btn btn-success' >Cerrar <i className='fa fa-save' /></button>
        <button onClick={this.savePresale.bind(this, false)} className='btn btn-success' >Actualizar <i className='fa fa-pencil' /></button>
      </div>
      <div className='sale-content-product' >
        <Product />
      </div>
      <div className={cartClass} >
        <Cart />
      </div>
      <div className={totalClass} >
        ₡ {this.props.total.formatMoney()}
      </div>
    </div>

  }

}
// EXPORT THE CLASS WITH ROUTER
export default withRouter(Content)