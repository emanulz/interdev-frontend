/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getItemDispatch} from '../../../../utils/api'
import {productSelected} from './actions.js'

@connect((store) => {
  return {
    products: store.products.products,
    client: store.clients.clientSelected,
    itemsInCart: store.cart.cartItems,
    inputVal: store.products.inputVal,
    globalDiscount: store.cart.globalDiscount,
    is_closed: store.purchase.is_closed,
  }
})
export default class Product extends React.Component {

  componentDidMount() {
    this.codeInput.focus()
  }

  componentDidUpdate() {
    // this.codeInput.focus()
  }

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PRODUCTS', payload: ''})

    const productKwargs = {
      url: '/api/products',
      successType: 'FETCH_PRODUCTS_FULFILLED',
      errorType: 'FETCH_PRODUCTS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(productKwargs))

  }

  searchProductClick() {

    this.props.dispatch({type: 'PRODUCT_SHOW_PANEL', payload: -1})

  }

  inputKeyPress(ev) {
    // if Key pressed id Enter
    if (ev.key == 'Enter') {
      if (ev.target.value) {
        const code = ev.target.value.split('*')[0] // Split val [0] is code [1] is qty
        let qty = ev.target.value.split('*')[1]
        qty = (isNaN(qty))
          ? 1
          : parseFloat(qty) // if no qty sets to 1

        this.props.dispatch(productSelected(code, qty, this.props.products, this.props.itemsInCart,
          this.props.globalDiscount, this.props.client, this.props.defaultConfig, this.props.userConfig))
        // this.props.dispatch(productSelected(code, qty, this.props.products, this.props.itemsInCart,
        //   this.props.globalDiscount, this.props.client, this.props.defaultConfig, this.props.userConfig))
        this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})
        this.props.dispatch({type: 'SET_PRODUCT_ACTIVE_IN_CART', payload: code})
      }
    } else {
      this.props.dispatch({type: 'SET_PRODUCT_FIELD_VALUE', payload: ev.target.value})
    }

  }

  // Render the product
  render() {

    return <div className='product'>
      <div className='product-inputs'>
        <div className='product-inputs-code'>
          <i className='fa fa-barcode' />
          <input id='productCodeInputField' disabled={this.props.disabled}
            disabled = {this.props.is_closed}
            onKeyDown={this.inputKeyPress.bind(this)}
            value={this.props.inputVal}
            onChange={this.inputKeyPress.bind(this)}
            ref={(input) => {
              this.codeInput = input
            }}
            type='text' placeholder={this.props.isEdit?'Deshabilitado en Compras cerradas':'Ingrese el Código del Producto'}
            className='product-inputs-code-input mousetrap form-control input-lg' />
        </div>
        <button disabled={this.props.disabled} onClick={this.searchProductClick.bind(this)}
          className='product-inputs-search'>
          <span>
            <i className='fa fa-search' />
          </span>
        </button>

      </div>

    </div>

  }

}
