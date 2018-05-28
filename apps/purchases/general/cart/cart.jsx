/*
 * Module dependencies
 */
import React from 'react'
import CartItems from './cartItems.jsx'
import {connect} from 'react-redux'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    // defaultConfig: store.config.defaultSales,
    // userConfig: store.config.userSales,
    // productSearchpanelVisible: store.searchProducts.visible
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
        <div className='cart-header-total'>
          <h5>Sub Total</h5>
        </div>
      </div>

      <CartItems />

    </div>

  }

}
