/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getEarmings} from './actions.js'

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
    this.props.dispatch({type: 'SET_PRESALE_TYPE', payload: 'REGULAR'})
    this.props.dispatch({type: 'SHOW_SEND_PANEL', payload: -1})
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
  }
  saveProforma() {
    this.props.dispatch({type: 'SET_PRESALE_TYPE', payload: 'QUOTING'})
    this.props.dispatch({type: 'SHOW_SEND_PANEL', payload: -1})
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
  }
  showExemptionPanel() {
    this.props.dispatch({type: 'SHOW_EXEMPTION_PANEL', payload: -1})
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
    const reserveBtn = this.props.globalConf.useReserves
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

    const exemptionBtn = this.props.globalConf.canTaxExemptPresales
      ? <button
        disabled={this.props.disabled}
        onClick={this.showExemptionPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Exonerar
        <span>
          <i className='fa fa-map' />
        </span>
      </button>
      : ''

    const extraButtons = <div>
      {exemptionBtn}
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

      {buttons}

      {extraButtons}

    </div>

  }

}
