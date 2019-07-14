/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    disabled: store.completed.completed,
    globalConf: store.config.globalConf,
    cart: store.cart
  }
})
export default class Buttons extends React.Component {

  showSendPanel() {
    const _this = this
    this.props.dispatch({type: 'SHOW_SEND_PANEL', payload: -1})
    document.getElementById('presaleCodeInput').focus()
    Mousetrap.bind('esc', function() {
      _this.props.dispatch({type: 'HIDE_SEND_PANEL', payload: -1})
      document.getElementById('productCodeInputField').focus()
      document.getElementById('productCodeInputField').value = ''
      Mousetrap.unbind('esc')
    })
  }
  newOrder() {
    // window.location.reload()
    window.location.href = '/purchases/orders'
    // this.props.dispatch({type: 'NEW_SALE', payload: -1})
  }

  // Main Layout
  render() {

    const buttons = this.props.disabled
      ? <div>
        <button
          onClick={this.newOrder.bind(this)}
          style={{
            'height': '48px',
            'width': '49%',
            'marginTop': '10px'
          }}
          className='btn btn-default buttons-payButton'>
          Nueva Orden
          <span>
            <i className='fa fa-refresh' />
          </span>
        </button>
      </div>
      : ''
    const orderBtn = this.props.globalConf.CanCreateOrders
      ? <button
        disabled={this.props.disabled}
        onClick={this.showSendPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Guardar Orden
        <span>
          <i className='fa fa-save' />
        </span>
      </button>
      : ''

    return <div className='col-xs-12 buttons'>

      {orderBtn}
      {buttons}

    </div>

  }

}
