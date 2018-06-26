/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {disabled: store.completed.completed}
})
export default class Buttons extends React.Component {

  showPayPanel() {
    this.props.dispatch({type: 'SHOW_PAY_PANEL', payload: -1})
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
  showWorkOrdersPanel() {
    this.props.dispatch({type: 'SHOW_WORK_ORDERS_PANEL', payload: -1})
  }
  showTodaySalesPanel() {
    this.props.dispatch({type: 'SHOW_TODAY_SALES_PANEL', payload: -1})
  }
  newSale() {
    // window.location.reload()
    window.location.href = '/sales'
    // this.props.dispatch({type: 'NEW_SALE', payload: -1})
  }

  // Main Layout
  render() {

    const buttons = this.props.disabled
      ? <div>
        <button
          onClick={this.showInoicePanel.bind(this)}
          style={{
            'height': '48px',
            'width': '49%',
            'marginTop': '10px'
          }}
          className='btn btn-default buttons-payButton'>
          Factura
          <span>
            <i className='fa fa-money' />
          </span>
        </button>
        <button
          onClick={this.newSale.bind(this)}
          style={{
            'height': '48px',
            'width': '49%',
            'marginTop': '10px'
          }}
          className='btn btn-default buttons-payButton'>
          Nueva Venta
          <span>
            <i className='fa fa-refresh' />
          </span>
        </button>
      </div>
      : ''

    return <div className='col-xs-12 buttons'>

      {/* <span>
        <b>Pago:<br /></b>
      </span> */}
      <button
        disabled={this.props.disabled}
        onClick={this.showPresalesPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Pre-Ventas
        <span>
          <i className='fa fa-list' />
        </span>
      </button>

      <button
        disabled={this.props.disabled}
        onClick={this.showWorkOrdersPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Órdenes Taller
        <span>
          <i className='fa fa-list' />
        </span>
      </button>

      <button
        disabled={this.props.disabled}
        onClick={this.showPayPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Cobrar
        <span>
          <i className='fa fa-credit-card' />
        </span>
      </button>

      <button
        disabled={this.props.disabled}
        onClick={this.showTodaySalesPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Ventas del día
        <span>
          <i className='fa fa-list' />
        </span>
      </button>

      {/* <button
        disabled={this.props.disabled}
        onClick={this.showInoicePanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Factura
        <span>
          <i className='fa fa-credit-card' />
        </span>
      </button> */}

      {buttons}

    </div>

  }

}
