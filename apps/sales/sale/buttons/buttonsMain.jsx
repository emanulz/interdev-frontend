/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {loadPresaleItem} from '../presales/actions.js'
import {getPendingRestaurantBills} from '../restaurantBills/actions.js'
import {getPendingWorkOrders} from '../workOrders/actions.js'
import {getPendingReserves} from '../reserves/actions.js'
import {getPendingNSReserves} from '../nsreserves/actions.js'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    disabled: store.completed.completed,
    isWorkOrderLoaded: store.completed.isWorkOrderLoaded,
    isPresaleLoaded: store.completed.isPresaleLoaded,
    isQuotationLoaded: store.completed.isQuotationLoaded,
    isReserveLoaded: store.completed.isReserveLoaded,
    isReinvoiceLoaded: store.completed.isReinvoiceLoaded,
    isRestaurantBillLoaded: store.completed.isRestaurantBillLoaded,
    useReserves: store.config.globalConf.useReserves,
    useNSReserves: store.config.globalConf.useNSReserves,
    usePresales: store.config.globalConf.usePresales,
    useQuoting: store.config.globalConf.useQuoting,
    useResrestaurant: store.config.globalConf.useRestaurant,
    acceptCashAdvances: store.config.globalConf.acceptCashAdvances,
    workshopAppInstalled: store.config.installed_apps.WorkshopAppInstalled,
    activePresaleId: store.presales.activePresaleId,
    savePresaleAsReserve: store.config.globalConf.savePresaleAsReserve,
    user: store.user.user,
    reinvoices: store.reinvoices.reinvoices
  }
})
export default class Buttons extends React.Component {

  showPayPanel() {
    document.getElementById('pay-cash-input').focus()
    const _this = this
    Mousetrap.bind('esc', function() {
      _this.props.dispatch({type: 'HIDE_PAY_PANEL', payload: -1})
      _this.props.dispatch({type: 'CLEAR_PAY_OBJECT', payload: -1})
      document.getElementById('productCodeInputField').focus()
      document.getElementById('productCodeInputField').value = ''
      Mousetrap.unbind('esc')
    })
    this.props.dispatch({type: 'SHOW_PAY_PANEL', payload: -1})
  }
  showInvoicePanel() {
    this.props.dispatch({type: 'SHOW_REPRINT_INVOICE_PANEL', payload: -1})
  }
  showSalePanel() {
    this.props.dispatch({type: 'SHOW_SALES_PANEL', payload: -1})
  }
  showExemptionPanel() {
    this.props.dispatch({type: 'SHOW_EXEMPTION_PANEL', payload: -1})
  }
  showPresalesPanel() {
    const _this = this
    Mousetrap.unbind('enter')
    Mousetrap.bind('esc', function() {
      _this.props.dispatch({type: 'HIDE_PRESALES_PANEL', payload: -1})
      document.getElementById('productCodeInputField').focus()
      document.getElementById('productCodeInputField').value = ''
      Mousetrap.unbind('esc')
      Mousetrap.unbind('up')
      Mousetrap.unbind('down')
      Mousetrap.unbind('enter')
    })
    Mousetrap.bind('down', function(e) {
      _this.props.dispatch({type: 'PRESALES_INCREASE_ACTIVE_INDEX', payload: -1})
    })
    Mousetrap.bind('up', function(e) {
      _this.props.dispatch({type: 'PRESALES_DECREASE_ACTIVE_INDEX', payload: -1})
    })
    Mousetrap.bind('enter', function(e) {
      loadPresaleItem(_this.props.activePresaleId, _this.props.dispatch)
      Mousetrap.unbind('enter')
    })
    // Mousetrap.bind('enter', function(e) {
    //   _this.props.dispatch({type: 'PRESALES_DECREASE_ACTIVE_INDEX', payload: -1})
    // })
    this.props.dispatch({type: 'SHOW_PRESALES_PANEL', payload: -1})
  }
  showReservesPanel() {
    this.props.dispatch({type: 'SHOW_RESERVES_PANEL', payload: -1})
    const kwargs = {
      url: '/api/presales',
      ordering: '-consecutive',
      filterField: 'closed',
      filter: 'True',
      filterField2: 'billed',
      filter2: 'False',
      filterField3: 'is_null',
      filter3: 'False',
      successType: 'FETCH_RESERVES_FULFILLED',
      errorType: 'FETCH_RESERVES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingReserves(kwargs))
  }
  showNSReservesPanel() {
    this.props.dispatch({type: 'SHOW_NSRESERVES_PANEL', payload: -1})
    const kwargs = {
      url: '/api/presales',
      ordering: '-consecutive',
      filterField: 'closed',
      filter: 'True',
      filterField2: 'billed',
      filter2: 'False',
      filterField3: 'is_null',
      filter3: 'False',
      successType: 'FETCH_NSRESERVES_FULFILLED',
      errorType: 'FETCH_NSRESERVES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingNSReserves(kwargs))
  }
  showQuotationsPanel() {
    this.props.dispatch({type: 'SHOW_QUOTATIONS_PANEL', payload: -1})
  }
  showWorkOrdersPanel() {
    this.props.dispatch({type: 'SHOW_WORK_ORDERS_PANEL', payload: -1})
    const kwargs = {
      url: '/api/listworkorders',
      ordering: '-updated',
      filterField: 'is_closed',
      filter: 'True',
      filterField2: 'paid',
      filter2: 'False',
      filterField3: 'is_null',
      filter3: 'False',
      filterField4: 'is_warranty',
      filter4: 'False',
      filterField5: 'closed_no_repair',
      filter5: 'False',
      successType: 'FETCH_WORK_ORDERS_FULFILLED',
      errorType: 'FETCH_WORK_ORDERS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingWorkOrders(kwargs))
  }
  showTodaySalesPanel() {
    this.props.dispatch({type: 'SHOW_TODAY_SALES_PANEL', payload: -1})
  }

  showCashAdvancesPanel() {
    this.props.dispatch({type: 'SHOW_CASH_ADVANCE_PANEL', payload: -1})
  }

  showRestaurantBillsPanel() {
    this.props.dispatch({type: 'SHOW_RESTAURANT_BILLS_PANEL', payload: -1})
    const kwargs = {
      url: '/api/presales',
      ordering: '-consecutive',
      filterField: 'closed',
      filter: 'True',
      filterField2: 'billed',
      filter2: 'False',
      filterField3: 'is_null',
      filter3: 'False',
      filterField4: 'destroyed',
      filter4: 'False',
      successType: 'FETCH_RESTAURANT_BILLS_FULFILLED',
      errorType: 'FETCH_RESTAURANT_BILLS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingRestaurantBills(kwargs))
  }

  showReinvoicesPanel() {
    this.props.dispatch({type: 'SHOW_REINVOICES_PANEL', payload: -1})
  }

  showSaveReservePanel() {
    this.props.dispatch({type: 'SHOW_SAVE_RESERVE_PANEL', payload: -1})
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
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isReserveLoaded || this.props.isQuotationLoaded || this.props.isNSReserveLoaded}
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

    const quotationsBtn = this.props.useQuoting
      ? <button
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isReserveLoaded || this.props.isQuotationLoaded || this.props.isNSReserveLoaded}
        onClick={this.showQuotationsPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Cotizaciones
        <span>
          <i className='fa fa-list' />
        </span>
      </button>
      : ''
    const reinvoicesBtn = this.props.reinvoices.length
      ? <button
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isReserveLoaded || this.props.isQuotationLoaded || this.props.isNSReserveLoaded || this.props.isReinvoiceLoaded}
        onClick={this.showReinvoicesPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Re-facturas
        <span>
          <i className='fa fa-list' />
        </span>
      </button>
      : ''

    const restaurantBillsBtn = this.props.useResrestaurant
      ? <button
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isRestaurantBillLoaded || this.props.isQuotationLoaded || this.props.isNSReserveLoaded}
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
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isRestaurantBillLoaded || this.props.isQuotationLoaded || this.props.isNSReserveLoaded}
        onClick={this.showReservesPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Reservas
        <span>
          <i className='fa fa-list' />
        </span>
      </button>
      : ''

    const nsreservesBtn = this.props.useNSReserves
      ? <button
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isRestaurantBillLoaded || this.props.isQuotationLoaded || this.props.isReserveLoaded}
        onClick={this.showNSReservesPanel.bind(this)}
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
        disabled={this.props.disabled || this.props.isPresaleLoaded || this.props.isReserveLoaded || this.props.isRestaurantBillLoaded || this.props.isQuotationLoaded || this.props.isNSReserveLoaded}
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
        disabled={this.props.disabled || this.props.isPresaleLoaded || this.props.isReserveLoaded || this.props.isRestaurantBillLoaded || this.props.isQuotationLoaded || this.props.isNSReserveLoaded}
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

    const saveReserveBtn = this.props.savePresaleAsReserve && this.props.user.is_superuser && (this.props.isPresaleLoaded || this.props.isQuotationLoaded)
      ? <button
        disabled={this.props.disabled}
        onClick={this.showSaveReservePanel.bind(this)}
        id='save-as-reserve-btn'
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

    const buttons = this.props.disabled
      ? <div>
        <button
          id='show-invoice-again-btn'
          onClick={this.showInvoicePanel.bind(this)}
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

      {/* {reservesBtn}
      {nsreservesBtn}
      {cashAdvanceBtn}
      {quotationsBtn} */}

      <button
        id='sale-facturar-btn'
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

      {presalesBtn}
      {workOrdersBtn}
      {reinvoicesBtn}
      {restaurantBillsBtn}
      {saveReserveBtn}
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
