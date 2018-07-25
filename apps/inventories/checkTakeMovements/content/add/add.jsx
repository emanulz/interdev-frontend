/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {setProduct, getProductTakeMovements} from './actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    addFieldValue: store.checkTakeMovements.addFieldValue,
    takeId: store.checkTakeMovements.physicalTakeId
  }
})
export default class Add extends React.Component {

  inputKeyPress(ev) {
    // if Key pressed id Enter
    const _this = this
    if (ev.key == 'Enter') {
      if (ev.target.value) {
        const code = ev.target.value

        const setProductPromise = new Promise((resolve, reject) => {
          const kwargs = {
            lookUpField: 'code',
            url: '/api/productslist/',
            lookUpValue: code,
            lookUpName: 'código',
            modelName: 'Productos'
          }
          // CLEAR ALL BEFOR START
          _this.props.dispatch({type: 'CLEAR_CHECK_TAKE_MOVEMENTS_CART', payload: ''})
          _this.props.dispatch({type: 'CLEAR_CHECK_TAKE_PRODUCT_MOVEMENTS', payload: ''})
          _this.props.dispatch({type: 'CLEAR_CHECK_TAKE_PRODUCT_ACTIVE', payload: ''})
          setProduct(kwargs, resolve, reject)
        })

        setProductPromise.then((data) => {
          _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
          const product = data.results[0]

          _this.getProductMovements(product)

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
      this.props.dispatch({type: 'SET_CHECK_ADD_FIELD_VALUE', payload: ev.target.value})
    }
  }
  getProductMovements(product) {
    const takeId = this.props.takeId
    const _this = this
    if (takeId) {
      const getProductMovementsPromise = new Promise((resolve, reject) => {
        const kwargs = {
          url: `/api/physicaltakes/${takeId}/get_product_movements/?product_id=${product.id}`
        }
        // _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        getProductTakeMovements(kwargs, resolve, reject)
      })

      getProductMovementsPromise.then((data) => {
        const payload = {
          id: product.id,
          movements: data
        }

        _this.props.dispatch({type: 'ADD_CHECK_TAKE_PRODUCT_MOVEMENTS', payload: payload})
        _this.props.dispatch({type: 'SET_CHECK_TAKE_PRODUCT_ACTIVE', payload: product.id})

        _this.props.dispatch({type: 'CLEAR_CHECK_ADD_FIELD_VALUE', payload: ''})
        const cartData = {
          movements: data
        }
        _this.props.dispatch({type: 'ADD_TO_CHECK_TAKE_MOVEMENTS_CART', payload: cartData})

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

    return <div className='check-take-movements-content-add'>
      <div className='check-take-movements-content-add-container'>
        <input
          type='text'
          onKeyDown={this.inputKeyPress.bind(this)}
          onChange={this.inputKeyPress.bind(this)}
          value={this.props.addFieldValue}
          placeholder='Ingrese el código del producto'
        />
        <i className='fa fa-barcode' />
      </div>
      <div className='check-take-movements-content-add-search'>
        <i className='fa fa-search' />
      </div>
    </div>

  }

}
