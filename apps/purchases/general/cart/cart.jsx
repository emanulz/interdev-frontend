/*
 * Module dependencies
 */
import React from 'react'
import CartItems from './cartItems.jsx'
import {connect} from 'react-redux'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    discount_mode: store.cart.discount_mode,
  }
})
export default class Cart extends React.Component {

  componentWillMount() {

    const _this = this
    Mousetrap.bind('mod+b', function(e) {

      if (e.preventDefault) {
        e.preventDefault()
      } else {
      // internet explorer
        e.returnValue = false
      }

      _this.props.dispatch({type: 'SEARCH_PRODUCT_TOGGLE_PANEL', payload: -1})
      document.getElementById('product-search-input').focus()
      document.getElementById('product-search-input').value = ''

      Mousetrap.bind('esc', function() {
        _this.props.dispatch({type: 'SEARCH_PRODUCT_TOGGLE_PANEL', payload: -1})
        document.getElementById('productCodeInputField').focus()
        document.getElementById('productCodeInputField').value = ''
        Mousetrap.unbind('esc')
      })
    })

    Mousetrap.bind('mod+c', function(e) {

      if (e.preventDefault) {
        e.preventDefault()
      } else {
      // internet explorer
        e.returnValue = false
      }

      _this.props.dispatch({type: 'SEARCH_CLIENT_TOGGLE_PANEL', payload: -1})
      document.getElementById('client-search-input').focus()
      document.getElementById('client-search-input').value = ''

      Mousetrap.bind('esc', function() {
        _this.props.dispatch({type: 'SEARCH_CLIENT_TOGGLE_PANEL', payload: -1})
        document.getElementById('productCodeInputField').focus()
        document.getElementById('productCodeInputField').value = ''
        Mousetrap.unbind('esc')
      })
    })
  }

  discountRadioChanged(e){
    this.props.dispatch({type:'SET_DISCOUNT_MODE', payload: e.target.value})
  }

  // Main Layout
  render() {

    return <div className='cart'>
      <div className='cart-header'>
        <div className='cart-header-code'>
          <h5>Cód</h5>
        </div>
        <div className='cart-header-description'>
          <h5>Art</h5>
        </div>
        <div className='cart-header-qty'>
          <h5>Cant</h5>
        </div>
        <div className="cart-header-cost">
          <h5>Costo Und</h5>
        </div>
        <div className="cart-header-discount">
          <h5>Descuento </h5>
            <div className="cart-header-discount-radio" >
              <input type="radio" name="discount_mode" value="money_based" onChange={this.discountRadioChanged.bind(this)} />
                ₡
            </div> 
            <div className="cart-header-discount-radio" >
              <input type="radio" name="discount_mode" value="percent_based" defaultChecked={this.props.discount_mode==='percent_based'} onChange={this.discountRadioChanged.bind(this)}/>
                %
            </div>
        </div>
        <div className="cart-header-discountToClient">
          <h5>A Cliente</h5>
        </div>
        <div className='cart-header-total'>
          <h5>Sub Total</h5>
        </div>
      </div>

      <CartItems />

    </div>

  }

}
