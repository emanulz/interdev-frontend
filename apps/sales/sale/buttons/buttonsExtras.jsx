/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getPendingQuotations} from '../quotations/actions'
import {getPendingReserves} from '../reserves/actions.js'
import {getPendingNSReserves} from '../nsreserves/actions.js'
import {searchDiscountForTargetPrice} from '../../general/product/actions.js'

@connect((store) => {
  return {
    disabled: store.completed.completed,
    isWorkOrderLoaded: store.completed.isWorkOrderLoaded,
    isPresaleLoaded: store.completed.isPresaleLoaded,
    isQuotationLoaded: store.completed.isQuotationLoaded,
    isReserveLoaded: store.completed.isReserveLoaded,
    isRestaurantBillLoaded: store.completed.isRestaurantBillLoaded,
    useReserves: store.config.globalConf.useReserves,
    useNSReserves: store.config.globalConf.useNSReserves,
    usePresales: store.config.globalConf.usePresales,
    useQuoting: store.config.globalConf.useQuoting,
    useResrestaurant: store.config.globalConf.useRestaurant,
    acceptCashAdvances: store.config.globalConf.acceptCashAdvances,
    workshopAppInstalled: store.config.installed_apps.WorkshopAppInstalled,
    calculatesDiscountForFinalPrice: store.config.globalConf.calculatesDiscountForFinalPrice,
    cartItems: store.cart.cartItems,
    globalDiscount: store.cart.globalDiscount,
    client: store.clients.clientSelected,
    config: store.config.globalConf
  }
})
export default class Buttons extends React.Component {

  showPayPanel() {
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
  showReferenceDocPanel() {
    this.props.dispatch({type: 'SHOW_REFERENCE_DOC_PANEL', payload: -1})
  }
  showPresalesPanel() {
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
    const kwargs = {
      url: '/api/presales',
      ordering: '-consecutive',
      filterField: 'closed',
      filter: 'True',
      filterField2: 'billed',
      filter2: 'False',
      filterField3: 'is_null',
      filter3: 'False',
      successType: 'FETCH_QUOTATIONS_FULFILLED',
      errorType: 'FETCH_QUOTATIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingQuotations(kwargs))
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

  searchDiscount() {
    // shown an alertify input for the wanted target price
    searchDiscountForTargetPrice(
      this.props.dispatch, 
      this.props.cartItems,
      this.props.globalDiscount,
      this.props.client,
      this.props.config.overrideXMLversion
    )
  }

  // Main Layout
  render() {

    const targetPriceBtn = this.props.calculatesDiscountForFinalPrice
      ? <button
        disabled={this.props.disabled || this.props.isPresaleLoaded || this.props.isReserveLoaded || this.props.isRestaurantBillLoaded || this.props.isQuotationLoaded || this.props.isNSReserveLoaded}
        onClick={this.searchDiscount.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Total Objetivo
        <span>
          <i className='fa fa-list' />
        </span>
      </button>
      : ''
    /*
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
    */
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
        Proformas
        <span>
          <i className='fa fa-list' />
        </span>
      </button>
      : ''
    /*
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
    */
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
    /*
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
    */

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

    const buttons = this.props.disabled
      ? <div>
        <button
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

      <button
        disabled={this.props.disabled || this.props.isWorkOrderLoaded || this.props.isPresaleLoaded || this.props.isReserveLoaded || this.props.isQuotationLoaded || this.props.isNSReserveLoaded}
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

      <button
        disabled={this.props.disabled}
        onClick={this.showReferenceDocPanel.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Doc Referencia
        <span>
          <i className='fa fa-file-o' />
        </span>
      </button>

      {quotationsBtn}
      {reservesBtn}
      {nsreservesBtn}
      {cashAdvanceBtn}
      {targetPriceBtn}

      {/* {workOrdersBtn} */}

      {buttons}

    </div>
  }
}
