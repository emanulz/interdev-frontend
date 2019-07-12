/*
 * Module dependencies
 */
import React from 'react'
import CartItems from './cartItems.jsx'
import {connect} from 'react-redux'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    discount_mode: store.purchase_cart.discount_mode,
  }
})
export default class Cart extends React.Component {

  componentWillMount() {

    const _this = this
    Mousetrap.bind('f1', function(e) {

      if (e.preventDefault) {
        e.preventDefault()
      } else {
      // internet explorer
        e.returnValue = false
      }

      _this.props.dispatch({type: 'productSearch_TOGGLE_SEARCH_PANEL', payload: -1})
      document.getElementById('productSearch-input-field').focus()
      document.getElementById('productSearch-input-field').value = ''

      Mousetrap.bind('esc', function() {
        _this.props.dispatch({type: 'productSearch_TOGGLE_SEARCH_PANEL', payload: -1})
        document.getElementById('productCodeInputField').focus()
        document.getElementById('productCodeInputField').value = ''
        Mousetrap.unbind('esc')
        Mousetrap.unbind('up')
        Mousetrap.unbind('down')
      })
      Mousetrap.bind('down', function(e) {
        _this.props.dispatch({type: 'productSearch_INCREASE_ACTIVE_INDEX', payload: -1})
      })
      Mousetrap.bind('up', function(e) {
        _this.props.dispatch({type: 'productSearch_DECREASE_ACTIVE_INDEX', payload: -1})
      })
    })

    Mousetrap.bind('f2', function(e) {

      if (e.preventDefault) {
        e.preventDefault()
      } else {
      // internet explorer
        e.returnValue = false
      }

      _this.props.dispatch({type: 'clientSearch_TOGGLE_SEARCH_PANEL', payload: -1})
      document.getElementById('clientSearch-input-field').focus()
      document.getElementById('clientSearch-input-field').value = ''

      Mousetrap.bind('esc', function() {
        _this.props.dispatch({type: 'clientSearch_TOGGLE_SEARCH_PANEL', payload: -1})
        document.getElementById('productCodeInputField').focus()
        document.getElementById('productCodeInputField').value = ''
        Mousetrap.unbind('esc')
        Mousetrap.unbind('up')
        Mousetrap.unbind('down')
      })
    })
  }

  discountRadioChanged(e){
    this.props.dispatch({type:'SET_DISCOUNT_MODE', payload: e.target.value})
  }

  // Main Layout
  render() {

    return <div className='purchase-cart'>
      <div className='purchase-cart-header'>
        <div className='purchase-cart-header-code'>
          <h5>Cód</h5>
        </div>
        <div className='purchase-cart-header-description'>
          <h5>Art</h5>
        </div>
        <div className='purchase-cart-header-qty'>
          <h5>Cant</h5>
        </div>
        <div className="purchase-cart-header-cost">
          <h5>Costo Und</h5>
        </div>
        <div className="purchase-cart-header-discount">
          <h5>Descuento </h5>
            <div className="purchase-cart-header-discount-radio" >
              <input type="radio" name="discount_mode" value="money_based" onChange={this.discountRadioChanged.bind(this)} />
                ₡
            </div> 
            <div className="purchase-cart-header-discount-radio" >
              <input type="radio" name="discount_mode" value="percent_based" defaultChecked={this.props.discount_mode==='percent_based'} onChange={this.discountRadioChanged.bind(this)}/>
                %
            </div>
        </div>
        <div className="purchase-cart-header-discountToClient">
          <h5>A Cliente</h5>
        </div>
        <div className='purchase-cart-header-total'>
          <h5>Sub Total</h5>
        </div>
      </div>

      <CartItems />

    </div>

  }

}
