/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
// import {getItemDispatch} from '../../../../utils/api'
import {productSelected, setProduct, setProductNew, determinPriceToUse} from './actions.js'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    products: store.products.products,
    client: store.clients.clientSelected,
    itemsInCart: store.cart.cartItems,
    inputVal: store.products.inputVal,
    globalDiscount: store.cart.globalDiscount,
    warehouse_id: store.userProfile.salesWarehouse,
    disabled: store.completed.completed,
    presaleLoaded: store.completed.isPresaleLoaded,
    reserveLoaded: store.completed.isReserveLoaded,
    config: store.config.globalConf,
    priceListSelected: store.priceList.listSelected,
    usePriceListAsDefault: store.priceList.useAsDefault
    // defaultConfig: store.config.defaultSales,
    // userConfig: store.config.userSales
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

    // this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PRODUCTS', payload: ''})

    // const productKwargs = {
    //   url: '/getproducts',
    //   successType: 'FETCH_PRODUCTS_FULFILLED',
    //   errorType: 'FETCH_PRODUCTS_REJECTED'
    // }

    // this.props.dispatch(getItemDispatch(productKwargs))

  }

  searchProductClick() {

    this.props.dispatch({type: 'productSearch_TOGGLE_SEARCH_PANEL', payload: -1})
    document.getElementById('productSearch-input-field').focus()
    document.getElementById('productSearch-input-field').value = ''
    const _this = this

    Mousetrap.bind('esc', function() {
      _this.props.dispatch({type: 'productSearch_TOGGLE_SEARCH_PANEL', payload: -1})
      document.getElementById('productCodeInputField').focus()
      document.getElementById('productCodeInputField').value = ''
      Mousetrap.unbind('esc')
    })

    Mousetrap.bind('down', function(e) {
      _this.props.dispatch({type: 'productSearch_INCREASE_ACTIVE_INDEX', payload: -1})
    })
    Mousetrap.bind('up', function(e) {
      _this.props.dispatch({type: 'productSearch_DECREASE_ACTIVE_INDEX', payload: -1})
    })

  }

  inputKeyPress(ev) {
    // if Key pressed id Enter
    const _this = this
    if (ev.key == 'Enter') {

      let code = ''
      let qty = 1
      let price = 0
      let description = ''
      let useTaxes = true

      if (ev.target.value) {
        const firstChar = ev.target.value.charAt(0)
        // IF ITS AN ABREVIATE METHOD
        if (firstChar == '+' || firstChar == '*' || firstChar == '-') {
          const value = ev.target.value.substr(1)
          if (firstChar == '+') {
            description = value.split('*')[0]
            qty = Math.abs(value.split('*')[2])
            price = Math.abs(value.split('*')[1])
          }
          if (firstChar == '*') {
            description = 'Varios'
            qty = 1
            price = Math.abs(value)
          }
          if (firstChar == '-') {
            description = value.split('*')[0]
            qty = Math.abs(value.split('*')[2])
            price = Math.abs(value.split('*')[1])
            useTaxes = false
          }

          qty = (isNaN(qty))
            ? 1
            : parseFloat(qty)

          price = (isNaN(price))
            ? 0
            : parseFloat(price)

          let priceNoIV = price / (1 + (13 / 100))

          if (firstChar == '-') {
            priceNoIV = price
          }

          const set00ProductPromiseNew = new Promise((resolve, reject) => {
            const kwargs = {
              url: '/api/products/getProdPrice/',
              data: {
                prod_data: {
                  code: '00'
                },
                clientId: _this.props.client.client.id
              }
            }

            _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
            setProductNew(kwargs, resolve, reject)
          })

          set00ProductPromiseNew.then((data) => {
            _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
            const product = data[0].product
            product.price = priceNoIV
            product.use_taxes = true
            product.taxes = 13
            product.use_taxes2 = false
            product.taxes2 = 0
            product.use_taxes3 = false
            product.taxes3 = 0
            product.description = description
            try {
              if (!useTaxes) {
                product.use_taxes = false
                product.taxes = 0
              }
            } catch (err) {
              console.log(err)
            }

            if (product.code == '00') {
              const generalItemDefaultData = {
                default_discount: '0',
                id: product.id,
                max_discount: '0',
                product: product,
                table_price: '0',
                target_price_list: 'price1',
                current_discount: 0,
                promo_string: '',
                money_discount: 0,
                force_pricing: -1
              }
              this.props.dispatch(productSelected(generalItemDefaultData, qty, this.props.itemsInCart,
                this.props.client, this.props.warehouse_id, false, this.props.priceListSelected,
                this.props.usePriceListAsDefault))

              this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})

            } else {
            }

          }).catch((err) => {
            _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
            console.log(err)
          })

        } else {
          // IN CASE IS NOT AN ABREVIATE METHOD
          code = ev.target.value.split('*')[0] // Split val [0] is code [1] is qty
          qty = Math.abs(ev.target.value.split('*')[1])

          qty = (isNaN(qty))
            ? 1
            : parseFloat(qty) // if no qty sets to 1

          const setProductPromiseNew = new Promise((resolve, reject) => {
            const kwargs = {
              url: '/api/products/getProdPrice/',
              data: {
                clientId: _this.props.client.client.id,
                prod_data: {
                  code: code
                }
              }
            }

            _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
            setProductNew(kwargs, resolve, reject)
          })

          setProductPromiseNew.then((data) => {
            _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
            const product = data[0].product
            if (product.code == '00') {
              _this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
              _this.props.dispatch({type: 'SHOW_GENERAL_ITEM_PANEL', payload: ''})
            } else {
              // ADD THE DETAIL TO PRODUCT DETAIL OBJECTS
              // _this.props.dispatch({type: 'ADD_TO_PRICES_DETAILS', payload: data[0]})
              this.props.dispatch(productSelected(data[0], qty, this.props.itemsInCart,
                this.props.client, this.props.warehouse_id, true, this.props.priceListSelected,
                this.props.usePriceListAsDefault))
              _this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})
              _this.props.dispatch({type: 'SET_PRODUCT_ACTIVE_IN_CART', payload: code})
            }

          }).catch((err) => {
            _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
            console.log(err)
          })
        }

      }
    } else {
      this.props.dispatch({type: 'SET_PRODUCT_FIELD_VALUE', payload: ev.target.value})
    }

  }

  // Render the product
  render() {

    return <div className='product'>
      {/* <div className='product-title'>
        <span>
          <b>Producto:</b>
        </span>
      </div> */}
      <div className='product-inputs'>
        <div className='product-inputs-code'>
          <i className='fa fa-barcode' />
          <input id='productCodeInputField'
            disabled={this.props.disabled || (this.props.presaleLoaded && !this.props.config.canEditPresales) || this.props.reserveLoaded}
            onKeyDown={this.inputKeyPress.bind(this)}
            value={this.props.inputVal}
            onChange={this.inputKeyPress.bind(this)}
            ref={(input) => {
              this.codeInput = input
            }}
            type='text' placeholder='Ingrese el Código del Producto'
            className='product-inputs-code-input mousetrap form-control input-lg' />
        </div>
        <button disabled={this.props.disabled || this.props.presaleLoaded} onClick={this.searchProductClick.bind(this)}
          className='product-inputs-search'>
          <span>
            <i className='fa fa-search' />
          </span>
        </button>

      </div>

    </div>

  }

}
