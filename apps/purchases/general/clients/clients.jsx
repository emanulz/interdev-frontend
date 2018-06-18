/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import {clientSelected, searchClient, userSelected} from './actions'
import {getItemDispatch} from '../../../../utils/api'
import {getClientDebt} from '../../../../utils/getClientDebt'
import {recalcCart} from '../../general/product/actions'

@connect((store) => {
  return {
    clients: store.clients.clients,
    clientSelected: store.clients.clientSelected,
    cart: store.cart.cartItems,
    globalDiscount: store.cart.globalDiscount,
    client: store.clients.clientSelected,
    users: store.clients.users,
    user: store.clients.userSelected,
    // movements: store.clientmovements.movements,
    debt: store.clients.clientSelectedDebt
    // disabled: store.sales.completed
  }
})
export default class Clients extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.clientSelected != this.props.clientSelected) {
      // set the discount: default value or 0

      if (!nextProps.clientSelected.saleLoaded) {

        const kwargs = {
          client_id: nextProps.clientSelected.id,
          success: 'SET_CLIENT_DEBT',
          fail: 'SET_CLIENT_DEBT_FAILED'
        }

        const discount = nextProps.client.defaultDiscount ? nextProps.client.defaultDiscount : 0

        this.props.dispatch(recalcCart(nextProps.cart, discount, nextProps.client))
        this.props.dispatch({type: 'SET_GLOBAL_DISCOUNT', payload: discount})

        this.props.dispatch(getClientDebt(kwargs))

        // SETS VALUE OF DEFAULT DISCOUNT TO FIELD OR 0
        if (nextProps.client.defaultDiscount) {
          document.getElementById('discountField').value = discount
          document.getElementById('discountField').disabled = true
        } else {
          document.getElementById('discountField').value = ''
          document.getElementById('discountField').disabled = false
        }
      }
    }
  }

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENTS', payload: ''})

    const clientKwargs = {
      url: '/api/clients',
      successType: 'FETCH_CLIENTS_FULFILLED',
      errorType: 'FETCH_CLIENTS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(clientKwargs))

  }

  inputKeyPress(ev) {
    // if Key pressed id Enter
    if (ev.key == 'Enter') {

      const code = ev.target.value // Split val [0] is code [1] is qty
      this.props.dispatch(clientSelected(code, this.props.clients)) // dispatchs action according to result
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

    this.props.dispatch(searchClient())

  }

  // Main Layout
  render() {

    // ********************************************************************
    // SELECT2 DATA
    // ********************************************************************

    const clientToShow = (this.props.clientSelected)
      ? `${this.props.clientSelected.name} ${this.props.clientSelected.last_name}`
      : 'Cliente Contado'

    // const creditIcon = (this.props.clientSelected && this.props.clientSelected.has_credit)
    //   ? 'fa fa-check-square'
    //   : 'fa fa-times-circle'

    return <div className='client'>

      <div className='client-img'>
        <img disabled={this.props.disabled} onClick={this.searchClientClick.bind(this)}
          src='/media/default/profile.jpg'
        />
      </div>

      <div className='client-data'>

        <div className='client-data-row'>
          <h3>Cliente :</h3>
          <input disabled={this.props.disabled} onKeyDown={this.inputKeyPress.bind(this)}
            type='text'
          />
        </div>

        <div className='client-data-row'>
          <h3>Nombre :</h3>
          <span>{clientToShow}</span>
        </div>

      </div>

    </div>

  }

}
