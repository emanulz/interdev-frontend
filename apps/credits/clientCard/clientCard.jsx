import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    client: store.clients.clientActive
  }
})
export default class ClientCard extends React.Component {

  hidePanel() {
    const element = document.getElementById('clientCard')
    element.classList.remove('visible')
  }

  render() {
    const phones = this.props.client.locals
      ? this.props.client.locals.map(local => local.phone_number)
      : []
    const phones_str = phones.join(' / ')

    const address = this.props.client.locals
      ? this.props.client.locals.map(local => local.other_address)
      : []
    const address_str = address.join(' / ')

    const emails = this.props.client.locals
      ? this.props.client.locals.map(local => local.email)
      : []
    const emails_str = emails.join(' / ')

    return <div id='clientCard' className='client-card'>
      <div className='client-card-body'>
        <div className='client-card-body-header'>
          <span>DATOS DEL CLIENTE</span>
          <i onClick={this.hidePanel.bind(this)} className='fa fa-close' />
        </div>
        <div className='client-card-body-content'>
          <div className='client-card-body-content-element'>
            <span>Nombre:</span>
            <span>{this.props.client ? `${this.props.client.name} ${this.props.client.last_name}` : 'SIN NOMBRE'}</span>
          </div>
          <div className='client-card-body-content-element'>
            <span>Teléfonos:</span>
            <span>{phones_str}</span>
          </div>
          <div className='client-card-body-content-element'>
            <span>Dirección:</span>
            <span>{address_str}</span>
          </div>
          <div className='client-card-body-content-element'>
            <span>Emails:</span>
            <span>{emails_str}</span>
          </div>
        </div>
      </div>
    </div>
  }
}
