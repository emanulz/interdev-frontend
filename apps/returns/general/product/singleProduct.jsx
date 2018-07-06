/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {productSelected} from './actions.js'

@connect((store) => {
  return {
    isVisible: store.products.singleProductVisible,
    product: store.products.sigleProductActive,
    salesWarehouse: store.config.salesWarehouse,
    qty: store.products.singleProductQty,
    client: store.clients.clientSelected,
    itemsInCart: store.cart.cartItems,
    globalDiscount: store.cart.globalDiscount,
    warehouse_id: store.config.salesWarehouse
  }
})
export default class SingleProduct extends React.Component {

  componentWillMount() {

  }
  hidePanel () {
    this.props.dispatch({type: 'TOGGLE_SINGLE_PRODUCT_PANEL', payload: ''})
    this.props.dispatch({type: 'CLEAR_SINGLE_PRODUCT_QTY', payload: ''})
  }
  setSingleProductQty(ev) {
    if (ev.key == 'Enter') {
      this.addItemToCart()
    } else {
      const val = parseFloat(ev.target.value)
      this.props.dispatch({type: 'SET_SINGLE_PRODUCT_QTY', payload: val})
    }

  }
  addItemToCart() {
    const qty = this.props.qty ? this.props.qty : 1
    this.props.dispatch({type: 'HIDE_SINGLE_PRODUCT_PANEL', payload: ''})
    this.props.dispatch({type: 'CLEAR_SINGLE_PRODUCT_QTY', payload: ''})
    this.props.dispatch({type: 'productSearch_HIDE_SEARCH_PANEL', payload: ''})
    this.props.dispatch(productSelected(this.props.product.code, qty, this.props.product, this.props.itemsInCart,
      this.props.globalDiscount, this.props.client, this.props.warehouse_id))
  }
  // *******************************************************************
  // Main Layout
  render() {
    const product = this.props.product
    const panelClass = this.props.isVisible ? 'single-product-panel visible' : 'single-product-panel'
    const productStr = this.props.product.code ? `${this.props.product.code} - ${this.props.product.description}` : ''
    const existance = this.props.product.inventory_existent ? (JSON.parse(product.inventory_existent)[this.props.salesWarehouse] || 0) : 0
    const srcCode = ('000000' + this.props.product.code).slice(-6)
    console.log(srcCode)
    const imageUrl = `/media/Imagenes/${srcCode}.jpg`

    return <div className={panelClass}>
      <div className='single-product-panel-header'>
        <span>{productStr}</span>
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='single-product-panel-add'>
        <button className='btn btn-success' onClick={this.addItemToCart.bind(this)} >Agregar</button>
        <input
          type='number'
          className='input'
          value={this.props.qty}
          onChange={this.setSingleProductQty.bind(this)}
          onKeyDown={this.setSingleProductQty.bind(this)}
        />
      </div>
      <div className='single-product-panel-content'>
        <div className='single-product-panel-content-data'>
          <table>
            <tbody>
              <tr>
                <th>Código:</th>
                <td>{product.code || 'N/A'}</td>
              </tr>
              <tr>
                <th>Descripción:</th>
                <td>{product.description || 'N/A'}</td>
              </tr>
              <tr>
                <th>Modelo</th>
                <td>{product.model || 'N/A'}</td>
              </tr>
              <tr>
                <th>Código de Proveedor</th>
                <td>{product.supplier_code || 'N/A'}</td>
              </tr>
              <tr>
                <th>Número de parte</th>
                <td>{product.part_number || 'N/A'}</td>
              </tr>
              <tr>
                <th>Código de marca</th>
                <td>{product.brand_code || 'N/A'}</td>
              </tr>
              <tr>
                <th>Existencia en bodega</th>
                <td>{existance}</td>
              </tr>
              <tr>
                <th>Precio IVI</th>
                <td>₡{parseFloat(product.sell_price).toFixed(2) || 'N/A'}</td>
              </tr>
            </tbody>

          </table>
        </div>
        <div className='single-product-panel-content-image'>
          <h1>Imagen del Artículo</h1>
          <img src={imageUrl} onError={(e) => { e.target.src = '/media/default/noimage.png' }} />
        </div>
      </div>
    </div>

  }

}
