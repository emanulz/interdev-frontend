/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import {userSelected, getFullClientByCode, determinClientName, determinClientLastName, determinClientEmail} from '../../../sales/general/clients/actions.js'
import {getProductsList, recalcCart} from '../../../sales/general/product/actions.js'

const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    clientVisible:store.fileTransfer.clientVisible,
    clients: store.clients.clients,
    clientSelected: store.clients.clientSelected,
    globalDiscount: store.cart.globalDiscount,
    client: store.clients.clientSelected,
    users: store.clients.users,
    user: store.clients.userSelected,
    debt: store.clients.clientSelectedDebt,
    disabled: store.completed.completed,
    extraClient: store.extras.client,
    listSelected: store.priceList.listSelected,
    useListAsDefault: store.priceList.useAsDefault,
    cartItems: store.cart.cartItems,
    pricesDetails: store.products.pricesDetails,
    presaleId: store.presales.presaleId
  }
})
export default class Clients extends React.Component {

  componentWillMount () {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    getFullClientByCode('00', this.props.dispatch)
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
    if (nextProps.clientSelected != this.props.clientSelected && !this.props.presaleId) {

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
          return item.product.code
        })
        const kwargs = {
          url: '/api/products/getProdPrice/',
          data: {
            clientId: nextProps.client.client.id,
            code: codesData
          }
        }
        if (codesData.length) {
          _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
          getProductsList(kwargs, resolve, reject)
        }
      })

      getNewLineDataPromise.then((data) => {
        _this.props.dispatch({type: 'SET_PRICES_DETAILS', payload: data})
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        // DISPATCH THE ACTION TO RECALC THE CART
        _this.props.dispatch(recalcCart(_this.props.cartItems, data, _this.props.listSelected, _this.props.useListAsDefault, true))
      }).catch((err) => {
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        console.log(err)
      })

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

  
  // Main Layout
  render() {
    if (!this.props.clientVisible){
      return ''
    }
    // ********************************************************************
    // SELECT2 DATA
    // ********************************************************************

    const clientName = determinClientName(this.props.clientSelected, this.props.extraClient)
    const clientLastName = determinClientLastName(this.props.clientSelected, this.props.extraClient)
    const clientEmail = determinClientEmail(this.props.clientSelected, this.props.extraClient)

    const clientNameInput = <div>{clientName}</div>
    const clientLastnameInput = <div>{clientLastName} </div>
    const clientEmailInput = <div>{clientEmail}</div>

    const nameToShow = this.props.clientSelected && this.props.clientSelected.client.code == '00' ? clientNameInput : <span>{clientName}</span>
    const lastNameToShow = this.props.clientSelected && this.props.clientSelected.client.code == '00' ? clientLastnameInput : <span>{clientLastName}</span>
    const emailToShow = this.props.clientSelected && this.props.clientSelected.client.code == '00' ? clientEmailInput : <span>{clientEmail}</span>

    return <div className='client'>

      <div className='client-data'>

        <div className='client-data-second-row'>
          <div className='client-data-second-row-inline'>
            <h3>Nombre :</h3>
            {nameToShow}
          </div>
          <div className='client-data-second-row-inline'>
            <h3>Apellido :</h3>
            {lastNameToShow}

          </div>

          <div className='client-data-second-row-inline'>
            <h3>Email :</h3>
            {emailToShow}
          </div>

        </div>

      </div>

    </div>

  }

}
