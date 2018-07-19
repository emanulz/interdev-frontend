/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {setProduct} from './actions.js'
import alertify from 'alertifyjs'
const uuidv1 = require('uuid/v1')

@connect((store) => {
  return {
    addFieldValue: store.takeMovements.addFieldValue
  }
})
export default class Add extends React.Component {

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

        const setProductPromise = new Promise((resolve, reject) => {
          const kwargs = {
            lookUpField: 'code',
            url: '/api/productslist/',
            lookUpValue: code,
            lookUpName: 'código',
            modelName: 'Productos',
            qty: qty
          }
          // _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
          setProduct(kwargs, resolve, reject)
        })

        setProductPromise.then((data) => {
          _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
          const product = data.results[0]
          const qtyNum = parseFloat(qty)

          if (!product.fractioned && !Number.isInteger(qtyNum)) {
            alertify.alert('NO FRACIONADO', `El producto seleccionado solo acepta valores enteros, no acepta fracionados`)
            return false
          }

          _this.props.dispatch({type: 'CLEAR_ADD_FIELD_VALUE', payload: ''})
          const cartData = {
            product: product,
            product_id: product.id,
            qty: qtyNum,
            uuid: uuidv1()
          }
          _this.props.dispatch({type: 'ADD_TO_TAKE_MOVEMENTS_CART', payload: cartData})

        }).catch((err) => {
          _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
          console.log(err)
        })

        // this.props.dispatch(productSelected(code, qty, this.props.products, this.props.itemsInCart,
        //   this.props.globalDiscount, this.props.client, this.props.defaultConfig, this.props.userConfig))
        // // this.props.dispatch(productSelected(code, qty, this.props.products, this.props.itemsInCart,
        // //   this.props.globalDiscount, this.props.client, this.props.defaultConfig, this.props.userConfig))
        // this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})
        // this.props.dispatch({type: 'SET_PRODUCT_ACTIVE_IN_CART', payload: code})
      }
    } else {
      this.props.dispatch({type: 'SET_ADD_FIELD_VALUE', payload: ev.target.value})
    }

  }

  // Main Layout
  render() {

    return <div className='take-movements-content-add'>
      <div className='take-movements-content-add-container'>
        <input
          type='text'
          onKeyDown={this.inputKeyPress.bind(this)}
          onChange={this.inputKeyPress.bind(this)}
          value={this.props.addFieldValue}
          placeholder='Ingrese el código del producto'
        />
        <i className='fa fa-barcode' />
      </div>
      <div className='take-movements-content-add-search'>
        <i className='fa fa-search' />
      </div>
    </div>

  }

}
