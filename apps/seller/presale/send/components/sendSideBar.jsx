import React from 'react'
// import {saveItem, loadSale} from '../actions'
import {connect} from 'react-redux'
import SaveBtn from '../../save/save.jsx'

@connect((store) => {
  return {
    cart: store.cart,
    client: store.clients.clientSelected,
    user: store.send.user
  }
})
export default class PaySideBar extends React.Component {

  render() {

    let sendButtonClass = 'send-tag tag-button'
    const total = parseFloat(this.props.cart.cartTotal)
    const client = this.props.client
    const clientName = client.name && client.last_name ? `${client.name} ${client.last_name}` : 'Predeterminado'

    sendButtonClass = (total > 0 && this.props.user.username)
      ? 'send-tag tag-button enable'
      : 'send-tag tag-button'

    return <div className='send-side-bar'>
      <div className='send-method-body-header'>
        <span>Resumen</span>
      </div>

      <div className='send-method-body-content'>

        <div className='send-tag left'>
          TOTAL :</div>
        <div className='send-tag right'>
          ₡ {this.props.cart.cartTotal.formatMoney(2, ',', '.')}</div>

        <div className='send-tag left'>CLIENTE :</div>
        <div className='send-tag right'>
          {clientName}</div>
        <br />

        <SaveBtn sendButtonClass={sendButtonClass} />

      </div>

    </div>

  }

}
