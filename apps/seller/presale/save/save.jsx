import React from 'react'
// import {saveItem, loadSale} from '../actions'
import { saveItem } from './actions'
import {connect} from 'react-redux'
import {loadPresaleToPrint} from '../../../../general/printPresale/actions.js'

@connect((store) => {
  return {
    cart: store.cart,
    client: store.clients.clientSelected.client,
    user: store.send.user,
    presaleType: store.send.presale_type,
    reserves_warehouse: store.config.reserves_warehouse
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
      closed: true,
      reserves_warehouse: this.props.reserves_warehouse,
      presale_type: this.props.presaleType
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

    updatePromise.then((data) => {
      this.props.dispatch({type: 'HIDE_SEND_PANEL', payload: ''})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      this.props.dispatch({type: 'PROCESS_COMPLETE', payload: ''})
      if (data.presale_type == 'RESERVE' || data.presale_type == 'QUOTING') {
        this.props.dispatch(loadPresaleToPrint(data.consecutive))
      }
    }).catch((err) => {
      console.log(err)
    })

  }

  render() {

    const btnSendText = this.props.presaleType == 'REGULAR' ? 'Enviar' : 'Guardar'
    const btnSendIcon = this.props.presaleType == 'REGULAR' ? 'fa fa-send' : 'fa fa-save'

    return <div onClick={this.saveBtn.bind(this)} className={this.props.sendButtonClass}>
      {btnSendText}
      <i className={btnSendIcon} aria-hidden='true' />
    </div>

  }

}
