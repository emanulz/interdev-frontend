/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {searchProduct} from './actions.js'

@connect((store) => {
  return {
    //products: store.products.products,
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


  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})

  }

  searchProductClick() {
    this.props.dispatch({type: 'productSearch_TOGGLE_SEARCH_PANEL'})
  }

  inputKeyPress(ev) {
    // if Key pressed id Enter
    if (ev.key == 'Enter') {
      if (ev.target.value) {
        let bits = ev.target.value.split('*')// Split val [0] is code [1] is qty
        const code = bits[0]
        const qty = isNaN(bits[1]) ? 1 : parseFloat(bits[1])
        this.props.dispatch(searchProduct(code, 'product', 'productSearch', qty, this.props.itemsInCart))
        this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE'})

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
