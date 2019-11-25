/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import {userSelected, getFullClientByCode, determinClientName, determinClientLastName, determinClientEmail} from './actions'
import {getProductsList, recalcCart} from '../product/actions'
import { getItemDispatch } from '../../../../utils/api.js'
import Select2 from 'react-select2-wrapper'
// import {recalcCart} from '../../general/product/actions'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    clients: store.clients.clients,
    clientSelected: store.clients.clientSelected,
    // cart: store.cart.cartItems,
    globalDiscount: store.cart.globalDiscount,
    client: store.clients.clientSelected,
    users: store.clients.users,
    user: store.clients.userSelected,
    // movements: store.clientmovements.movements,
    debt: store.clients.clientSelectedDebt,
    disabled: store.completed.completed,
    extraClient: store.extras.client,
    listSelected: store.priceList.listSelected,
    useListAsDefault: store.priceList.useAsDefault,
    cartItems: store.cart.cartItems,
    pricesDetails: store.products.pricesDetails,
    presaleId: store.presales.presaleId,
    workOrderId: store.workOrders.workOrderId,
    provinces: store.clientCreatePanel.provinces,
    cantons: store.clientCreatePanel.cantons,
    districts: store.clientCreatePanel.districts,
    towns: store.clientCreatePanel.towns
  }
})
export default class Clients extends React.Component {

  componentWillMount () {
    // IF THERE IS NO LOCAL STORAGE CLIENT
    if (!window.sessionStorage.getItem('generalClient')) {
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      getFullClientByCode('00', this.props.dispatch)
    } else {
      // IF THERE IS LOAD IT AND IF FAILS LOAD IT FROM BACKEND
      try {
        const client = JSON.parse(window.sessionStorage.getItem('generalClient'))
        this.props.dispatch({type: 'CLIENT_SELECTED', payload: client})
        this.props.dispatch({type: 'SET_CREDIT_DAYS', payload: 0})
      } catch (err) {
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        getFullClientByCode('00', this.props.dispatch)
      }
    }
  }

  determinPriceList(client, category) {
    if (client.category_id && category.pred_price_list) {
      return category.pred_price_list
    }
    if (!client.category_id && client.pred_price_list) {
      return client.pred_price_list
    }
    return 1
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clientSelected != this.props.clientSelected && !this.props.presaleId && !this.props.workOrderId) {
      // set the discount: default value or 0

      // const discount = nextProps.client.pred_discount ? nextProps.client.pred_discount : 0

      // this.props.dispatch(recalcCart(nextProps.cart, discount, nextProps.client))
      // this.props.dispatch({type: 'SET_GLOBAL_DISCOUNT', payload: discount})
      this.props.dispatch({type: 'SET_CLIENT_DEBT', payload: nextProps.client.client.balance})

      // SET THE CLIENT PRICE LIST
      // const priceList = nextProps.client.category.pred_price_list ? nextProps.client.category.pred_price_list : 1
      const priceList = this.determinPriceList(nextProps.client.client, nextProps.client.category)
      this.props.dispatch({type: 'SET_PRICE_LIST', payload: priceList})

      // WHEN CLIENT IS UPDATED SEND A REQUEST TO RECALC THE DETAIL DATA THEN DISPATCH IT AND UPDATE THE PRICES
      const _this = this

      const getNewLineDataPromise = new Promise((resolve, reject) => {
        const cartItems = _this.props.cartItems
        const codesData = cartItems.map(item => {
          console.log('ITEM IN UPDATE', item)
          // return item.product.code
          return {
            code: item.product.code,
            qty: item.qty,
            promo_string: item.pricesData.promo_string,
            money_discount: item.pricesData.money_discount,
            current_discount: item.discount,
            force_list: item.pricesData.force_list,
            // THE VARIABLE CHANGED IN THIS METHOD IS THE FORCE PRICING
            force_pricing: item.pricesData.force_pricing
          }
        })
        const kwargs = {
          url: '/api/products/getProdPrice/',
          data: {
            clientId: nextProps.client.client.id,
            prod_data: codesData
          }
        }
        console.log('PRICESS DETAILS SENT', kwargs.data)
        if (codesData.length) {
          _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
          getProductsList(kwargs, resolve, reject)
        }
      })

      getNewLineDataPromise.then((data) => {
        console.log('PRICESS DETAILS AFTER CLIENT UPDATE', data)
        // _this.props.dispatch({type: 'SET_PRICES_DETAILS', payload: data})
        _this.props.dispatch({type: 'SET_MASS_PRICES_DATA', payload: data})
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        // DISPATCH THE ACTION TO RECALC THE CART
        // _this.props.dispatch(recalcCart(_this.props.cartItems, data, _this.props.listSelected, _this.props.useListAsDefault, true))
      }).catch((err) => {
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        console.log(err)
      })

      // SETS VALUE OF DEFAULT DISCOUNT TO FIELD OR 0
      // if (nextProps.client.pred_discount) {
      //   document.getElementById('discountField').value = discount
      //   document.getElementById('discountField').disabled = true
      // } else {
      //   document.getElementById('discountField').value = ''
      //   document.getElementById('discountField').disabled = false
      // }

    }
  }

  inputKeyPress(ev) {
    // if Key pressed id Enter
    if (ev.key == 'Enter') {
      if (ev.target.value) {
        const code = ev.target.value
        getFullClientByCode(code, this.props.dispatch)
        document.getElementById('productCodeInputField').focus()
        document.getElementById('productCodeInputField').value = ''
      }
    } else {
      this.props.dispatch({type: 'SET_CLIENT_FIELD_VALUE', payload: ev.target.value})
    }

  }

  handleInputChange(event) {

    const target = event.target
    const value = target.value
    const name = target.name

    const client = {
      ...this.props.extraClient
    }

    client[name] = value

    this.props.dispatch({type: 'SET_EXTRAS_CLIENT', payload: client})
  }

  userSelect(ev) {
    const _id = ev.target.value
    this.props.dispatch(userSelected(_id, this.props.users)) // dispatchs action according to result
  }

  userUnSelect(ev) {
    this.props.dispatch({type: 'USER_CLEAR', payload: ''}) // dispatchs action according to result
  }

  searchClientClick() {

    // this.props.dispatch(searchClient())
    this.props.dispatch({type: 'clientSearch_TOGGLE_SEARCH_PANEL', payload: -1})
    document.getElementById('clientSearch-input-field').focus()
    document.getElementById('clientSearch-input-field').value = ''

    const _this = this

    Mousetrap.bind('esc', function() {
      _this.props.dispatch({type: 'clientSearch_TOGGLE_SEARCH_PANEL', payload: -1})
      document.getElementById('productCodeInputField').focus()
      document.getElementById('productCodeInputField').value = ''
      Mousetrap.unbind('esc')
    })

  }

  showClientPanel() {
    this.loadAdressData()
    this.props.dispatch({type: 'SHOW_CREATE_CLIENT_PANEL', payload: -1})
  }

  showClientUpdatePanel() {
    this.props.dispatch({type: 'SHOW_UPDATE_CLIENT_PANEL', payload: -1})
  }

  loadAdressData() {
    // Then fetch provinces of the model and dispatch to reducer
    // *******************************************************************
    const provinceKwargs = {
      url: '/api/provinces/?limit=10000',
      successType: 'FETCH_PROVINCES_FULFILLED',
      errorType: 'FETCH_PROVINCES_REJECTED'
    }
    if (!this.props.provinces.length) {
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(getItemDispatch(provinceKwargs))
    }
    // *******************************************************************

    // Then fetch cantons of the model and dispatch to reducer
    // *******************************************************************
    const cantonKwargs = {
      url: '/api/cantons/?limit=10000',
      successType: 'FETCH_CANTONS_FULFILLED',
      errorType: 'FETCH_CANTONS_REJECTED'
    }
    if (!this.props.cantons.length) {
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(getItemDispatch(cantonKwargs))
    }
    // *******************************************************************

    // Then fetch districts of the model and dispatch to reducer
    // *******************************************************************
    const districtKwargs = {
      url: '/api/districts/?limit=10000',
      successType: 'FETCH_DISTRICTS_FULFILLED',
      errorType: 'FETCH_DISTRICTS_REJECTED'
    }
    if (!this.props.districts.length) {
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(getItemDispatch(districtKwargs))
    }
    // *******************************************************************

    // Then fetch towns of the model and dispatch to reducer
    // *******************************************************************
    const townKwargs = {
      url: '/api/towns/?limit=10000',
      successType: 'FETCH_TOWNS_FULFILLED',
      errorType: 'FETCH_TOWNS_REJECTED'
    }
    if (!this.props.towns.length) {
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(getItemDispatch(townKwargs))
    }

  }

  doNothing() {

  }

  // determinClientName() {
  //   if (this.props.clientSelected.client) {
  //     if (this.props.clientSelected.client.code == '00') {
  //       return this.props.extraClient.name
  //     }
  //     return this.props.clientSelected.client.name
  //   }
  //   return 'Cliente'
  // }

  // determinClientLastName() {
  //   if (this.props.clientSelected.client) {
  //     if (this.props.clientSelected.client.code == '00') {
  //       return this.props.extraClient.last_name
  //     }
  //     return this.props.clientSelected.client.last_name
  //   }
  //   return 'General'
  // }

  // determinClientEmail() {
  //   if (this.props.clientSelected.client) {
  //     if (this.props.clientSelected.client.code == '00') {
  //       return this.props.extraClient.email
  //     }
  //     return this.props.clientSelected.client.email ? this.props.clientSelected.client.email : 'Sin Correo Registrado'
  //   }
  //   return 'Sin Correo Registrado'
  // }

  // Main Layout
  render() {

    // ********************************************************************
    // SELECT2 DATA
    // ********************************************************************

    const clientName = determinClientName(this.props.clientSelected, this.props.extraClient)
    const clientLastName = determinClientLastName(this.props.clientSelected, this.props.extraClient)
    const clientEmail = determinClientEmail(this.props.clientSelected, this.props.extraClient)

    const clientNameInput = <input className='mousetrap' type='text' value={clientName} name='name' onChange={this.handleInputChange.bind(this)} />
    const clientLastnameInput = <input className='mousetrap' type='text' value={clientLastName} name='last_name' onChange={this.handleInputChange.bind(this)} />
    const clientEmailInput = <input className='mousetrap' type='text' value={clientEmail} name='email' onChange={this.handleInputChange.bind(this)} />

    const nameToShow = this.props.clientSelected && this.props.clientSelected.client.code == '00' ? clientNameInput : <span>{clientName}</span>
    const lastNameToShow = this.props.clientSelected && this.props.clientSelected.client.code == '00' ? clientLastnameInput : <span>{clientLastName}</span>
    const emailToShow = this.props.clientSelected && this.props.clientSelected.client.code == '00' ? clientEmailInput : <span>{clientEmail}</span>

    const clientOnClick = this.props.disabled ? this.doNothing.bind(this) : this.showClientPanel.bind(this)
    const imgOnClick = this.props.disabled ? this.doNothing.bind(this) : this.searchClientClick.bind(this)
    const clientEditOnClick = this.props.disabled ? this.doNothing.bind(this) : this.showClientUpdatePanel.bind(this)

    const editClientIcon = this.props.clientSelected.client.code != '0000' && this.props.clientSelected.client.code != '00'
      ? <i disabled={this.props.disabled} className='fa fa-edit' onClick={clientEditOnClick} />
      : <i disabled className='fa' />

    const localsData = this.props.clientSelected.client.locals ? this.props.clientSelected.client.locals.map(local => {
      return {text: `${local.commercial_name} - ${local.email}`, id: local.id}
    })
      : []

    const localsDropdown = this.props.clientSelected.client.locals
      ? <Select2
        name='clientLocal'
        data={localsData}
        // value={this.props.clientLocal.province}
        className='form-control'
        // onSelect={this.handleInputChange.bind(this)}
        options={{
          placeholder: 'Elija un local...',
          noResultsText: 'Sin elementos'
        }}
      /> : <div />

    const clientLocalsRow = this.props.clientSelected.client.locals.length > 1
      ? <div className='client-data-second-row-inline'>
        <h3>Local :</h3>
        {localsDropdown}
      </div>
      : <div />

    return <div className='client'>

      {/* <div className='client-img'>
        <img disabled={this.props.disabled} onClick={imgOnClick}
          src='/media/default/profile.jpg'
        />
      </div> */}

      <div className='client-data'>

        <div className='client-data-first-row'>
          <h3>Cliente :</h3>
          <div className='client-data-first-row-input'>
            <input disabled={this.props.disabled} onKeyUp={this.inputKeyPress.bind(this)}
              type='text' className='mousetrap'
            />
            <i disabled={this.props.disabled} className='fa fa-search' onClick={imgOnClick} />
          </div>
        </div>

        <div className='client-data-second-row'>
          <div className='client-data-second-row-inline'>
            <h3>Nombre :</h3>
            {nameToShow}
            <i disabled={this.props.disabled} className='fa fa-plus-circle' onClick={clientOnClick} />
          </div>
          <div className='client-data-second-row-inline'>
            <h3>Apellido :</h3>
            {lastNameToShow}
            {editClientIcon}
          </div>

          <div className='client-data-second-row-inline'>
            <h3>Email :</h3>
            {emailToShow}
            <i disabled className='fa' />
          </div>

          {clientLocalsRow}

        </div>

      </div>

    </div>

  }

}
