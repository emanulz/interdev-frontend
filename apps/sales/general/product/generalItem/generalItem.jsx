/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {productSelected} from '../actions.js'

@connect((store) => {
  return {
    isVisible: store.generalItem.isVisible,
    product: store.generalItem.product,
    qty: store.generalItem.qty,
    client: store.clients.clientSelected,
    itemsInCart: store.cart.cartItems,
    globalDiscount: store.cart.globalDiscount,
    warehouse_id: store.userProfile.salesWarehouse,
    disabled: store.completed.completed,
    config: store.config.globalConf,
    priceListSelected: store.priceList.listSelected,
    usePriceListAsDefault: store.priceList.useAsDefault
  }
})
export default class GenerlItem extends React.Component {

  hidePanel() {
    this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})
    this.props.dispatch({type: 'CLEAR_GENERAL_ITEM_PRODUCT', payload: 0})
    this.props.dispatch({type: 'HIDE_GENERAL_ITEM_PANEL', payload: -1})
    document.getElementById('productCodeInputField').focus()
  }

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value

    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : 0
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const product = {
      ...this.props.product
    }
    product[name] = value

    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  addToCart() {
    const product = this.props.product
    const generalItemDefaultData = {
      default_discount: '0',
      id: product.id,
      max_discount: '0',
      product: product,
      table_price: '0',
      target_price_list: 'price1'
    }
    this.props.dispatch(productSelected(generalItemDefaultData, this.props.qty, this.props.itemsInCart,
      this.props.client, this.props.warehouse_id, false, this.props.priceListSelected,
      this.props.usePriceListAsDefault))
    // this.props.dispatch(productSelected(product.code, this.props.qty, product, this.props.itemsInCart,
    //   this.props.globalDiscount, this.props.client, this.props.warehouse_id, false))
    this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})
    this.props.dispatch({type: 'CLEAR_GENERAL_ITEM_PRODUCT', payload: 0})
    this.props.dispatch({type: 'HIDE_GENERAL_ITEM_PANEL', payload: -1})
    document.getElementById('productCodeInputField').focus()
  }

  updateQty(ev) {
    const value = ev.target.value
    this.props.dispatch({type: 'SET_GENERAL_ITEM_QTY', payload: value})
  }

  updatePrice(ev) {
    const value = ev.target.value
    const product = {
      ...this.props.product
    }
    product.sell_price = value
    if (product.use_taxes) {
      product.price = value / (1 + (product.taxes / 100))
    } else {
      product.price = value
    }
    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  updateUseTaxes(ev) {
    const value = ev.target.checked
    const product = {
      ...this.props.product
    }
    product.use_taxes = value
    if (product.use_taxes) {
      product.price = product.sell_price / (1 + (product.taxes / 100))
    } else {
      product.price = product.sell_price
    }
    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  updateTaxesAmount(ev) {
    const value = ev.target.value
    const product = {
      ...this.props.product
    }
    product.taxes = value
    if (product.use_taxes) {
      product.price = product.sell_price / (1 + (product.taxes / 100))
    } else {
      product.price = product.sell_price
    }
    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  // Render the product
  render() {

    const isVisible = (this.props.isVisible)
      ? 'general-item is-visible'
      : 'general-item'
    const observations = this.props.config.printProductObservationsInFullInvoice
      ? <div className='form-group'>
        <label>Observaciones</label>
        <input value={this.props.product.observations} name='observations' onChange={this.handleInputChange.bind(this)} type='text'
          className='form-control' onFocus={this.fieldFocus.bind(this)} />
      </div>
      : <div />
    return <div className={isVisible}>
      <div className='general-item-container'>
        <div className='general-item-container-header'>
          Añadir Artículo General
          <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
        </div>
        <div className='general-item-container-content'>

          <div className='general-item-container-content-left'>
            <h3>Datos del Artículo</h3>
            <div className='form-group'>
              <label>Descripción</label>
              <input value={this.props.product.description} name='description' onChange={this.handleInputChange.bind(this)} type='text'
                className='form-control' onFocus={this.fieldFocus.bind(this)} />
            </div>

            {observations}

            <div className='form-group'>
              <label>Es servicio?</label>
              <input checked={this.props.product.is_service} name='is_service'
                onChange={this.handleInputChange.bind(this)}
                type='checkbox' className='form-control' />
            </div>
            <div className='form-group'>
              <label>Usa Impuestos?</label>
              <input checked={this.props.product.use_taxes} name='use_taxes'
                onChange={this.updateUseTaxes.bind(this)}
                type='checkbox' className='form-control' />
            </div>
            <div className='form-group'>
              <label>Impuestos %</label>
              <input value={this.props.product.taxes} name='taxes' onChange={this.updateTaxesAmount.bind(this)} type='number'
                className='form-control' onFocus={this.fieldFocus.bind(this)} />
            </div>
          </div>

          <div className='general-item-container-content-right'>
            <h3>Precio</h3>

            <div className='form-group'>
              <label>Cantidad</label>
              <input value={this.props.qty} name='qty'
                onChange={this.updateQty.bind(this)}
                type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />
            </div>

            <div className='form-group'>
              <label>Precio IVI</label>
              <input value={this.props.product.sell_price} name='sell_price' onChange={this.updatePrice.bind(this)}
                type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />
            </div>

            <button onClick={this.addToCart.bind(this)} >Agregar</button>

          </div>
        </div>
      </div>
    </div>

  }

}
