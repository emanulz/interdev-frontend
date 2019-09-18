/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    disabled: store.completed.completed,
    globalConf: store.config.globalConf,
    cart: store.cart,
    user: store.user.user,
    extras: store.extras,
    currency: store.currency.currencySelected,
    exchange: store.currency.exchangeRateSelected,
    supplierName: store.freenote.supplierName,
    relatedDocument: store.freenote.relatedDocument
  }
})

class Buttons extends React.Component {

  confirmSaveSelfPurchase() {

    // ALERTIFY CONFIRM
    const _this = this
    alertify.confirm('CREAR', `Desea crear la nota con los datos seleccionados? Esta acción no se puede
    deshacer o modificar.`, function() {
      _this.saveSelfPurchase()
    }, function() {
      return true
    }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })

  }

  saveSelfPurchase() {
    const _this = this
    const data = {
      cart: JSON.stringify(this.props.cart),
      user: JSON.stringify(this.props.user),
      extras: JSON.stringify(this.props.extras),
      exchange_rate: this.props.exchange,
      currency_code: this.props.currency,
      supplier_name: this.props.supplierName,
      related_document: this.props.relatedDocument
    }

    const createPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      console.log('DATAA', data)
      axios({
        method: 'post',
        url: '/api/freereturns/',
        data: data
      })
        .then((response) => {
          this.props.dispatch({type: 'CLEAR_SELF_PURCHASE', payload: ''})
          resolve(response.data)
        }).catch((err) => {
          reject(err)
        })
    })

    createPromise.then((data) => {
      console.log(data)
      // REDIRECT TO LIST
      this.props.history.push('/admin/invoicing/creditnotes')
    }).catch((err) => {
      console.log(err.response.data)
      if (err.response) {
        console.log(err.response.data)
        alertify.alert('Error', `Error al crear la NOTA, ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
      } else {
        console.log('NO CUSTOM ERROR')
        console.log(err)
        alertify.alert('Error', `Error al crear la NOTA, ERROR: ${err}.`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }

  // Main Layout
  render() {

    return <div className='col-xs-12 buttons'>
      <button
        disabled={this.props.disabled}
        onClick={this.confirmSaveSelfPurchase.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Guardar Nota
        <span>
          <i className='fa fa-save' />
        </span>
      </button>
    </div>

  }

}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Buttons)
