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

  // Main Layout
  render() {
    // const useLote = this.props.defaultConfig
    //   ? this.props.defaultConfig.cartItemUseLote
    //   : false

    // const loteField = useLote
    //   ? <th>Lote</th>
    //   : <th />

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
        <div className='cart-header-unitPrice'>
          <h5>P Unit</h5>
        </div>
        <div className='cart-header-discount'>
          <h5>Desc</h5>
        </div>
        <div className='cart-header-iva'>
          <h5>IV</h5>
        </div>
        <div className='cart-header-total'>
          <h5>Total IVI</h5>
        </div>
      </div>

      <CartItems />

    </div>

  }

}
