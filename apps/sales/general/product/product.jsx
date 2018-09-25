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
      if (ev.target.value) {
        const code = ev.target.value.split('*')[0] // Split val [0] is code [1] is qty
        let qty = ev.target.value.split('*')[1]

        qty = (isNaN(qty))
          ? 1
          : parseFloat(qty) // if no qty sets to 1

        // const setProductPromise = new Promise((resolve, reject) => {
        //   const kwargs = {
        //     lookUpField: 'code',
        //     lookUpField2: 'barcode',
        //     url: '/api/productslist/',
        //     lookUpValue: code,
        //     lookUpName: 'código',
        //     lookUpName2: 'Código de Barras',
        //     modelName: 'Productos',
        //     qty: qty
        //   }

        //   _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        //   setProduct(kwargs, resolve, reject)
        // })

        const setProductPromiseNew = new Promise((resolve, reject) => {
          const kwargs = {
            url: '/api/products/getProdPrice/',
            data: {
              code: code,
              clientId: _this.props.client.client.id,
              other: 'other'
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
            _this.props.dispatch({type: 'ADD_TO_PRICES_DETAILS', payload: data[0]})
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

        // setProductPromise.then((data) => {
        //   _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        //   const product = data.results[0]
        //   if (product.code == '00') {
        //     _this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
        //     _this.props.dispatch({type: 'SHOW_GENERAL_ITEM_PANEL', payload: ''})
        //   } else {
        //     this.props.dispatch(productSelected(product.code, qty, product, this.props.itemsInCart,
        //       this.props.globalDiscount, this.props.client, this.props.warehouse_id))
        //     _this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})
        //     _this.props.dispatch({type: 'SET_PRODUCT_ACTIVE_IN_CART', payload: code})
        //   }

        // }).catch((err) => {
        //   _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        //   console.log(err)
        // })

        // this.props.dispatch(productSelected(code, qty, this.props.products, this.props.itemsInCart,
        //   this.props.globalDiscount, this.props.client, this.props.defaultConfig, this.props.userConfig))
        // // this.props.dispatch(productSelected(code, qty, this.props.products, this.props.itemsInCart,
        // //   this.props.globalDiscount, this.props.client, this.props.defaultConfig, this.props.userConfig))
        // this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})
        // this.props.dispatch({type: 'SET_PRODUCT_ACTIVE_IN_CART', payload: code})
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
