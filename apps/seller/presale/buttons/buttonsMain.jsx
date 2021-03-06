/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getEarmings} from './actions.js'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    disabled: store.completed.completed,
    globalConf: store.config.globalConf,
    cart: store.cart
  }
})
export default class Buttons extends React.Component {

  showPayPanel() {
    this.props.dispatch({type: 'SHOW_PAY_PANEL', payload: -1})
  }
  showSendPanel() {
    const _this = this
    this.props.dispatch({type: 'SET_PRESALE_TYPE', payload: 'REGULAR'})
    this.props.dispatch({type: 'SHOW_SEND_PANEL', payload: -1})
    document.getElementById('presaleCodeInput').focus()
    Mousetrap.bind('esc', function() {
      _this.props.dispatch({type: 'HIDE_SEND_PANEL', payload: -1})
      document.getElementById('productCodeInputField').focus()
      document.getElementById('productCodeInputField').value = ''
      Mousetrap.unbind('esc')
    })
  }
  showInoicePanel() {
    this.props.dispatch({type: 'SHOW_INVOICE_PANEL', payload: -1})
  }
  showSalePanel() {
    this.props.dispatch({type: 'SHOW_SALES_PANEL', payload: -1})
  }
  showPresalesPanel() {
    this.props.dispatch({type: 'SHOW_PRESALES_PANEL', payload: -1})
  }
  saveReserve() {
    this.props.dispatch({type: 'SET_PRESALE_TYPE', payload: 'RESERVE'})
    this.props.dispatch({type: 'SHOW_SEND_PANEL', payload: -1})
    if (this.props.globalConf.printChangeOnReserve) {
      document.getElementById('presaleCashInput').focus()
    } else {
      document.getElementById('presaleCodeInput').focus()
    }
    const _this = this
    Mousetrap.bind('esc', function() {
      _this.props.dispatch({type: 'HIDE_SEND_PANEL', sendload: -1})
      _this.props.dispatch({type: 'CLEAR_PRESALE_CASH_AMOUNT', payload: 0})
      document.getElementById('productCodeInputField').focus()
      document.getElementById('productCodeInputField').value = ''
      Mousetrap.unbind('esc')
    })
  }
  saveProforma() {
    this.props.dispatch({type: 'SET_PRESALE_TYPE', payload: 'QUOTING'})
    this.props.dispatch({type: 'SHOW_SEND_PANEL', payload: -1})
    document.getElementById('presaleCodeInput').focus()
    const _this = this
    Mousetrap.bind('esc', function() {
      _this.props.dispatch({type: 'HIDE_SEND_PANEL', sendload: -1})
      _this.props.dispatch({type: 'CLEAR_PRESALE_CASH_AMOUNT', payload: 0})
      document.getElementById('productCodeInputField').focus()
      document.getElementById('productCodeInputField').value = ''
      Mousetrap.unbind('esc')
    })
  }
  showEarnings() {
    getEarmings(this.props.cart)
  }
  showQuotationsPanel() {
    this.props.dispatch({type: 'SHOW_QUOTATIONS_PANEL', payload: -1})
  }
  saveNSReserve() {
    this.props.dispatch({type: 'SET_PRESALE_TYPE', payload: 'NS_RESERVE'})
    this.props.dispatch({type: 'SHOW_SEND_PANEL', payload: -1})
    document.getElementById('presaleCodeInput').focus()
    const _this = this
    Mousetrap.bind('esc', function() {
      _this.props.dispatch({type: 'HIDE_SEND_PANEL', sendload: -1})
      _this.props.dispatch({type: 'CLEAR_PRESALE_CASH_AMOUNT', payload: 0})
      document.getElementById('productCodeInputField').focus()
      document.getElementById('productCodeInputField').value = ''
      Mousetrap.unbind('esc')
    })
  }
  newSale() {
    // window.location.reload()
    window.location.href = '/seller'
    // this.props.dispatch({type: 'NEW_SALE', payload: -1})
  }

  // Main Layout
  render() {

    const buttons = this.props.disabled
      ? <div>
        <button
          onClick={this.newSale.bind(this)}
          style={{
            'height': '48px',
            'width': '49%',
            'marginTop': '10px'
          }}
          className='btn btn-default buttons-payButton'>
          Nueva Pre-Venta
          <span>
            <i className='fa fa-refresh' />
          </span>
        </button>
      </div>
      : ''
    const reserveBtn = this.props.globalConf.useReserves && this.props.globalConf.reserveAsDefaultPresale
      ? <button
        disabled={this.props.disabled}
        onClick={this.saveReserve.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Guardar Reserva
        <span>
          <i className='fa fa-save' />
        </span>
      </button>
      : ''
    const nsreserveBtn = this.props.globalConf.useNSReserves
      ? <button
        disabled={this.props.disabled}
        onClick={this.saveNSReserve.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Guardar Apartado
        <span>
          <i className='fa fa-save' />
        </span>
      </button>
      : ''
    const proformaBtn = this.props.globalConf.useQuoting
      ? <button
        disabled={this.props.disabled}
        onClick={this.saveProforma.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Guardar Proforma
        <span>
          <i className='fa fa-save' />
        </span>
      </button>
      : ''

    const earningsBtn = this.props.globalConf.showEarningsInPresales
      ? <button
        disabled={this.props.disabled}
        onClick={this.showEarnings.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Rentabilidad
        <span>
          <i className='fa fa-money' />
        </span>
      </button>
      : ''

    const quotationsBtn = this.props.globalConf.useQuoting
      ? <button
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isReserveLoaded || this.props.isQuotationLoaded}
        onClick={this.showQuotationsPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Prof Guardadas
        <span>
          <i className='fa fa-list' />
        </span>
      </button>
      : ''

    const extraButtons = <div>
      {reserveBtn}
      {nsreserveBtn}
      {proformaBtn}
      {earningsBtn}
      {quotationsBtn}
    </div>

    return <div className='col-xs-12 buttons'>

      {/* <span>
        <b>Pago:<br /></b>
      </span> */}

      {/* <button
        disabled
        onClick={this.showPayPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Guardar Borrador
        <span>
          <i className='fa fa-save' />
        </span>
      </button>

      <button
        disabled
        onClick={this.showSalePanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Preventas Guardadas
        <span>
          <i className='fa fa-list' />
        </span>
      </button> */}
      {reserveBtn}
      <button
        disabled={this.props.disabled}
        onClick={this.showSendPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Enviar a Caja
        <span>
          <i className='fa fa-credit-card-alt' />
        </span>
      </button>

      {buttons}

    </div>

  }

}
