/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import {searchClient} from './actions'
import {getItemDispatch} from '../../../../utils/api'

@connect((store) => {
  return {
    clients: store.clients.clients,
    clientSelected: store.clients.clientSelected,
    client: store.clients.clientSelected,
    users: store.clients.users,
    user: store.clients.userSelected,

  }
})
export default class Clients extends React.Component {

  componentWillReceiveProps(nextProps) {
  }

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED'})

    const clientKwargs = {
      url: '/api/clients/?code=00',
      successType: 'CLIENT_SELECTED_LIST',
      errorType: 'FETCH_CLIENT_REJECTED'
    }

    this.props.dispatch(getItemDispatch(clientKwargs))

  }

  componentWillUnmount(){
    this.props.dispatch({type:'CLIENT_UNSELECT'})
  }

  inputKeyPress(ev) {
    // if Key pressed id Enter
    if (ev.key == 'Enter') {
      const search_text = ev.target.value
      this.props.dispatch(searchClient(search_text, 'client', 'clientSearch')) // dispatchs action according to result
    }

  }

  searchClientClick() {
    this.props.dispatch({type:'clientSearch_TOGGLE_SEARCH_PANEL'})
  }

  showClientCreatePanel(){
    this.props.dispatch({type: 'SHOW_CREATE_CLIENT_PANEL'})
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
