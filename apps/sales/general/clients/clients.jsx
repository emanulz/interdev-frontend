/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import {userSelected, getFullClientByCode} from './actions'
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
    disabled: store.completed.completed
  }
})
export default class Clients extends React.Component {

  componentWillMount () {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    getFullClientByCode('00', this.props.dispatch)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clientSelected != this.props.clientSelected) {
      // set the discount: default value or 0

      // const discount = nextProps.client.pred_discount ? nextProps.client.pred_discount : 0

      // this.props.dispatch(recalcCart(nextProps.cart, discount, nextProps.client))
      // this.props.dispatch({type: 'SET_GLOBAL_DISCOUNT', payload: discount})
      this.props.dispatch({type: 'SET_CLIENT_DEBT', payload: nextProps.client.client.balance})

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
      }
    } else {
      this.props.dispatch({type: 'SET_CLIENT_FIELD_VALUE', payload: ev.target.value})
    }

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
    this.props.dispatch({type: 'SHOW_CREATE_CLIENT_PANEL', payload: -1})
  }

  doNothing() {

  }

  // Main Layout
  render() {

    // ********************************************************************
    // SELECT2 DATA
    // ********************************************************************

    const clientToShow = (this.props.clientSelected)
      ? `${this.props.clientSelected.client.name} ${this.props.clientSelected.client.last_name}`
      : 'Cliente Contado'

    // const creditIcon = (this.props.clientSelected && this.props.clientSelected.has_credit)
    //   ? 'fa fa-check-square'
    //   : 'fa fa-times-circle'
    const clientOnClick = this.props.disabled ? this.doNothing.bind(this) : this.showClientPanel.bind(this)
    const imgOnClick = this.props.disabled ? this.doNothing.bind(this) : this.searchClientClick.bind(this)
    return <div className='client'>

      <div className='client-img'>
        <img disabled={this.props.disabled} onClick={imgOnClick}
          src='/media/default/profile.jpg'
        />
      </div>

      <div className='client-data'>

        <div className='client-data-row'>
          <h3>Cliente :</h3>
          <input disabled={this.props.disabled} onKeyUp={this.inputKeyPress.bind(this)}
            type='text' className='mousetrap'
          />
          <i disabled={this.props.disabled} className='fa fa-plus-circle' onClick={clientOnClick} />
        </div>

        <div className='client-data-row'>
          <h3>Nombre :</h3>
          <span>{clientToShow}</span>
        </div>

      </div>

    </div>

  }

}
