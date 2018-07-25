/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {setProduct, getProductTakeMovements} from './actions.js'
import alertify from 'alertifyjs'
const uuidv1 = require('uuid/v1')

@connect((store) => {
  return {
    addFieldValue: store.takeMovements.addFieldValue,
    takeId: store.takeMovements.physicalTakeId
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

          const cartData = {
            product: product,
            product_id: product.id,
            qty: qtyNum,
            uuid: uuidv1()
          }

          const __this = _this

          if (!product.is_active) {
            alertify.confirm('CERRAR TOMA', `El producto se encuentra actualmente inactivo, desea agregarlo a la toma física? Esta acción activará el producto.`,
              function() {
                __this.props.dispatch({type: 'ADD_TO_TAKE_MOVEMENTS_CART', payload: cartData})
                __this.getProductMovements(product.id)
                __this.props.dispatch({type: 'CLEAR_ADD_FIELD_VALUE', payload: ''})
              }, function() {}).set('labels', {ok: 'Agregar', cancel: 'Cancelar'})
          } else {
            _this.props.dispatch({type: 'ADD_TO_TAKE_MOVEMENTS_CART', payload: cartData})
            _this.getProductMovements(product.id)
            _this.props.dispatch({type: 'CLEAR_ADD_FIELD_VALUE', payload: ''})
          }

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
  getProductMovements(id) {
    const takeId = this.props.takeId
    const _this = this
    if (takeId) {
      const getProductMovementsPromise = new Promise((resolve, reject) => {
        const kwargs = {
          url: `/api/physicaltakes/${takeId}/get_product_movements/?product_id=${id}`
        }
        // _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        getProductTakeMovements(kwargs, resolve, reject)
      })

      getProductMovementsPromise.then((data) => {
        const payload = {
          id: id,
          movements: data
        }

        _this.props.dispatch({type: 'ADD_TAKE_PRODUCT_MOVEMENTS', payload: payload})
        _this.props.dispatch({type: 'SET_TAKE_PRODUCT_ACTIVE', payload: id})

      }).catch((err) => {
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        console.log(err)
      })

    } else {
      alertify.alert('ALERTA', 'Por favor seleccione una toma física para ver los movimientos activos')
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
