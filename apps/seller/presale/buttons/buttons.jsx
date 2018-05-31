/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {disabled: store.sales.completed}
})
export default class Buttons extends React.Component {

  showPayPanel() {
    this.props.dispatch({type: 'SHOW_PAY_PANEL', payload: -1})
  }
  showSendPanel() {
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
  newSale() {
    // window.location.reload()
    window.location.href = '/sales/sale'
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
        disabled={this.props.disabled}
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
      </button>

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
