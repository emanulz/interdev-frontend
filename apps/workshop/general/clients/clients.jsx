/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import {searchClient} from './actions'
import { getItemDispatch } from '../../../../utils/api.js'

@connect((store) => {
  return {
    clients: store.clients.clients,
    clientSelected: store.clients.clientSelected,
    client: store.clients.clientSelected,
    disabled: store.clients.disabled,
    users: store.clients.users,
    user: store.clients.userSelected,
    is_edit: store.workorder.is_edit,
    provinces: store.clientCreatePanel.provinces,
    cantons: store.clientCreatePanel.cantons,
    districts: store.clientCreatePanel.districts,
    towns: store.clientCreatePanel.towns

  }
})
export default class Clients extends React.Component {

  componentWillReceiveProps(nextProps) {
  }

  componentWillMount() {
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'CLIENT_UNSELECT'})
  }

  inputKeyPress(ev) {
    // if Key pressed id Enter
    if (ev.key == 'Enter') {
      const search_text = ev.target.value
      this.props.dispatch(searchClient(search_text, 'client', 'clientSearch')) // dispatchs action according to result
    }

  }

  searchClientClick() {
    this.props.dispatch({type: 'clientSearch_TOGGLE_SEARCH_PANEL'})
  }

  showClientCreatePanel() {
    this.props.dispatch({type: 'SHOW_CREATE_CLIENT_PANEL'})
    this.loadAdressData()
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


  // Main Layout
  render() {

    const clientToShow = (this.props.clientSelected)
      ? `${this.props.clientSelected.name} ${this.props.clientSelected.last_name}`
      : 'Cliente Contado'

    let phone_element = ''
    let cellphone_element =''
    let email_element =''
    if(this.props.clientSelected.name !== "Cliente"){
      if(this.props.clientSelected.phone_number !== ''){
        phone_element = <div className="client-data-row">
        <span className='fa fa-phone'>{this.props.clientSelected.phone_number}</span>
      </div>
      }

      if(this.props.clientSelected.cellphone_number !== ''){
        cellphone_element = <div className="client-data-row">
        <span className='fa fa-mobile'>{this.props.clientSelected.cellphone_number}</span>
      </div>
      }

      if(this.props.clientSelected.email !== ''){
        email_element = <div className="client-data-row">
        <span className='fa fa-envelope'>{this.props.clientSelected.email}</span>
      </div>
      }

    }

    return <div className='client'>

      <div className='client-img'>
        <img disabled={this.props.disabled} onClick={this.searchClientClick.bind(this)}
          src='/media/default/profile.jpg'/>
        <div className="fa fa-plus" onClick={this.showClientCreatePanel.bind(this)} ></div>
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
        
        {phone_element}
        {cellphone_element}
        {email_element}
      </div>

    </div>

  }

}
