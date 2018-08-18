/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    disabled: store.completed.completed,
    isWorkOrderLoaded: store.completed.isWorkOrderLoaded,
    isPresaleLoaded: store.completed.isPresaleLoaded,
    isReserveLoaded: store.completed.isReserveLoaded,
    isRestaurantBillLoaded: store.completed.isRestaurantBillLoaded,
    useReserves: store.config.globalConf.useReserves,
    usePresales: store.config.globalConf.usePresales,
    useResrestaurant: store.config.globalConf.useRestaurant,
    acceptCashAdvances: store.config.globalConf.acceptCashAdvances,
    workshopAppInstalled: store.config.installed_apps.WorkshopAppInstalled
  }
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
  showExemptionPanel() {
    this.props.dispatch({type: 'SHOW_EXEMPTION_PANEL', payload: -1})
  }
  showPresalesPanel() {
    this.props.dispatch({type: 'SHOW_PRESALES_PANEL', payload: -1})
  }
  showReservesPanel() {
    this.props.dispatch({type: 'SHOW_RESERVES_PANEL', payload: -1})
  }
  showWorkOrdersPanel() {
    this.props.dispatch({type: 'SHOW_WORK_ORDERS_PANEL', payload: -1})
  }
  showTodaySalesPanel() {
    this.props.dispatch({type: 'SHOW_TODAY_SALES_PANEL', payload: -1})
  }

  showCashAdvancesPanel() {
    this.props.dispatch({type: 'SHOW_CASH_ADVANCE_PANEL', payload: -1})
  }

  showRestaurantBillsPanel() {
    this.props.dispatch({type: 'SHOW_RESTAURANT_BILLS_PANEL', payload: -1})
  }

  newSale() {
    // window.location.reload()
    window.location.href = '/sales'
    // this.props.dispatch({type: 'NEW_SALE', payload: -1})
  }

  // Main Layout
  render() {

    const presalesBtn = this.props.usePresales
      ? <button
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isReserveLoaded}
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
      : ''

    const restaurantBillsBtn = this.props.useResrestaurant
      ? <button
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isRestaurantBillLoaded}
        onClick={this.showRestaurantBillsPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Cuentas Restaurante
        <span>
          <i className='fa fa-list' />
        </span>
      </button>
      : ''

    const reservesBtn = this.props.useReserves
      ? <button
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isRestaurantBillLoaded}
        onClick={this.showReservesPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Apartados
        <span>
          <i className='fa fa-list' />
        </span>
      </button>
      : ''

    const workOrdersBtn = this.props.workshopAppInstalled
      ? <button
        disabled={this.props.disabled || this.props.isPresaleLoaded || this.props.isReserveLoaded || this.props.isRestaurantBillLoaded}
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
      : ''

    const cashAdvanceBtn = this.props.acceptCashAdvances
      ? <button
        disabled={this.props.disabled || this.props.isPresaleLoaded || this.props.isReserveLoaded || this.props.isRestaurantBillLoaded}
        onClick={this.showCashAdvancesPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Adelantos de efectivo
        <span>
          <i className='fa fa-money' />
        </span>
      </button>
      : ''

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

      {presalesBtn}
      {reservesBtn}
      {cashAdvanceBtn}
      {restaurantBillsBtn}

      <button
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

      {workOrdersBtn}

      <button
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isReserveLoaded}
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

      <button
        disabled={this.props.disabled}
        onClick={this.showPayPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Facturar
        <span>
          <i className='fa fa-credit-card' />
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
