import React from 'react'
// import {saveItem, loadSale} from '../actions'
import {connect} from 'react-redux'
import SaveBtn from '../save/save.jsx'
import {getFullClientByCode} from '../../../../sales/general/clients/actions.js'

@connect((store) => {
  return {
    cart: store.cart,
    clientSelected: store.clients.clientSelected,
    user: store.newBill.user,
    extraClient: store.extras.client
  }
})
export default class PaySideBar extends React.Component {

  componentWillMount () {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    getFullClientByCode('00', this.props.dispatch)
  }

  handleInputChange(event) {

    const target = event.target
    const value = target.value
    const name = target.name

    const client = {
      ...this.props.extraClient
    }

    client[name] = value
    client['last_name'] = ''

    this.props.dispatch({type: 'SET_EXTRAS_CLIENT', payload: client})
  }

  determinClientName() {
    if (this.props.clientSelected.client) {
      if (this.props.clientSelected.client.code == '00') {
        return this.props.extraClient.name
      }
      return this.props.clientSelected.client.name
    }
    return 'Cliente'
  }

  determinClientLastName() {
    if (this.props.clientSelected.client) {
      if (this.props.clientSelected.client.code == '00') {
        return this.props.extraClient.last_name
      }
      return this.props.clientSelected.client.last_name
    }
    return 'General'
  }

  determinClientEmail() {
    if (this.props.clientSelected.client) {
      if (this.props.clientSelected.client.code == '00') {
        return this.props.extraClient.email
      }
      return this.props.clientSelected.client.email ? this.props.clientSelected.client.email : 'Sin Correo Registrado'
    }
    return 'Sin Correo Registrado'
  }

  fieldFocus(ev) {
    ev.target.select()
    ev.target.setSelectionRange(0, 9999)
  }

  render() {

    const clientName = this.determinClientName()
    // const clientLastName = this.determinClientLastName()
    const clientEmail = this.determinClientEmail()

    const clientNameInput = <input id='newBillName' type='text' value={clientName} name='name' onChange={this.handleInputChange.bind(this)} onFocus={this.fieldFocus.bind(this)} />
    // const clientLastnameInput = <input type='text' value={clientLastName} name='last_name' onChange={this.handleInputChange.bind(this)} onFocus={this.fieldFocus.bind(this)} />
    const clientEmailInput = <input type='text' value={clientEmail} name='email' onChange={this.handleInputChange.bind(this)} onFocus={this.fieldFocus.bind(this)} />

    const nameToShow = this.props.clientSelected && this.props.clientSelected.client.code == '00' ? clientNameInput : <span>{clientName}</span>
    // const lastNameToShow = this.props.clientSelected && this.props.clientSelected.client.code == '00' ? clientLastnameInput : <span>{clientLastName}</span>
    const emailToShow = this.props.clientSelected && this.props.clientSelected.client.code == '00' ? clientEmailInput : <span>{clientEmail}</span>

    let newBillButtonClass = 'newBill-tag tag-button'

    newBillButtonClass = 'newBill-tag tag-button enable'

    return <div className='newBill-side-bar'>
      <div className='newBill-method-body-header'>
        <span>Cliente</span>
      </div>

      <div className='newBill-side-bar-body-content'>
        <div className='newBill-side-bar-body-content-row'>
          <div className='left'>
            Nombre :
          </div>
          {nameToShow}
        </div>
        {/* <div className='newBill-side-bar-body-content-row'>
          <div className='left'>
            Apellido :
          </div>
          {lastNameToShow}
        </div> */}
        <div className='newBill-side-bar-body-content-row'>
          <div className='left'>
            Email :
          </div>
          {emailToShow}
        </div>

        <SaveBtn newBillButtonClass={newBillButtonClass} />

      </div>

    </div>

  }

}
