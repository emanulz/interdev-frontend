/*
 * Module dependencies
 */
import React from 'react'
import CartItems from './cartItems.jsx'
import {callDoomsdayCheck} from './actions.js'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
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

    const callDoomsDay = new Promise((resolve, reject) => {
      callDoomsdayCheck(resolve, reject)
    })

    callDoomsDay.then((data) => {
      console.log('DATA', data)
      if (data == 'UPGRADED') {
        location.reload()
      }
    }).catch((err) => {
      alertify.alert('ERROR', `No se pudo comprobar que la versión de XML sea 4.3, despues del 1ero de Julio
        del 2019 se debe únicamente usar esta versión, por favor verifique manualmene que la versión sea correcta. 
        ERROR ${err}`)
    })

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
    Mousetrap.bind('mod+enter', function(e) {
      if (e.preventDefault) {
        e.preventDefault()
      } else {
      // internet explorer
        e.returnValue = false
      }
      e.stopPropagation()
      if (_this.props.caller == 'sales') {
        _this.props.dispatch({type: 'SHOW_PAY_PANEL', payload: -1})
        document.getElementById('pay-cash-input').focus()
        Mousetrap.bind('esc', function() {
          _this.props.dispatch({type: 'HIDE_PAY_PANEL', payload: -1})
          _this.props.dispatch({type: 'CLEAR_PAY_OBJECT', payload: -1})
          document.getElementById('productCodeInputField').focus()
          document.getElementById('productCodeInputField').value = ''
          Mousetrap.unbind('esc')
        })
      }
      if (_this.props.caller == 'presales') {
        _this.props.dispatch({type: 'SHOW_SEND_PANEL', payload: -1})
        document.getElementById('presaleCodeInput').focus()
        Mousetrap.bind('esc', function() {
          _this.props.dispatch({type: 'HIDE_SEND_PANEL', payload: -1})
          document.getElementById('productCodeInputField').focus()
          document.getElementById('productCodeInputField').value = ''
          Mousetrap.unbind('esc')
        })
      }
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
    const header = this.props.caller == 'requests'
      ? <div className='cart-header'>
        <div className='cart-header-requests-code'>
          <h5>Cód</h5>
        </div>
        <div className='cart-header-requests-description'>
          <h5>Art</h5>
        </div>
        <div className='cart-header-requests-qty'>
          <h5>Cant</h5>
        </div>
      </div>
      : <div className='cart-header'>
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
    return <div className='cart'>
      {header}
      <CartItems caller={this.props.caller} key='sales' dontCheckInv={this.props.dontCheckInv} />
    </div>

  }

}
