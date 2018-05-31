import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    cart: store.cart,
    client: store.clients.clientSelected,
    user: store.send.user
  }
})
export default class SaveBtn extends React.Component {

  saveBtn() {
    // const sales = this.props.sales
    const user = this.props.user

    const presale = {
      cart: JSON.stringify(this.props.cart),
      client: JSON.stringify(this.props.client),
      user: JSON.stringify(this.props.user),
      client_id: this.props.client.id,
      closed: true
    }

    const creditMovement = {
      client_id: this.props.client.id,
      movement_type: 'CRED',
      amount: this.props.cart.cartTotal
    }

    const kwargs = {
      url: '/api/presales/',
      item: presale,
      logCode: 'PRESALE_CREATE',
      logDescription: 'Creación de nueva Preventa',
      logModel: 'PRESALE',
      user: user,
      itemOld: '',
      sucessMessage: 'Preventa enviada a caja correctamente.',
      errorMessage: 'Hubo un error al crear la preventa, intente de nuevo.',
      creditMovement: creditMovement
    }

    const _this = this

    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveItem(kwargs, resolve, reject))
    })

    updatePromise.then(() => {
      this.props.dispatch({type: 'HIDE_SEND_PANEL', payload: ''})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch((err) => {
      console.log(err)
    })

  }

  render() {

    return <div onClick={this.saveBtn.bind(this)} className={this.props.sendButtonClass}>
      Enviar
      <i className='fa fa-send' aria-hidden='true' />
    </div>

  }

}
