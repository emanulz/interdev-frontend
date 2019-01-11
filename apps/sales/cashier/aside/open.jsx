/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import {getTotalAmount} from '../content/actions.js'
import { saveItem } from './actions'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    openBillList: store.cashier.openBillList,
    registerClosure: store.registerClosure.registerClosure,
    byNotes: store.cashier.byNotes,
    openTotalCRC: store.cashier.openTotalCRC,
    openTotalUSD: store.cashier.openTotalUSD,
  }
})
export default class Open extends React.Component {

  openRegister() {

    let crcTotals = this.props.openTotalCRC
    let usdTotals = this.props.openTotalUSD
    if(this.props.byNotes){
      crcTotals = getTotalAmount(this.props.openBillList, 'CRC')
      usdTotals = getTotalAmount(this.props.openBillList, 'USD')
    }


    const _this = this
    alertify.confirm('ABRIR', `Desea abir la caja con un monto de ₡${parseFloat(crcTotals).formatMoney()} y $${parseFloat(usdTotals).formatMoney()}`,
      function() {
        _this.saveBtn(parseFloat(crcTotals), parseFloat(usdTotals))
      }, function() {
        return true
      }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })

  }

  saveBtn(crc, usd) {
    const registerOpen = {
      usd_exchange_rate: 570,
      opening_money_crc: crc,
      opening_money_usd: usd,
      open_notes: JSON.stringify(this.props.openBillList)
    }

    const kwargs = {
      url: '/api/registerclosure/',
      item: registerOpen
    }

    const _this = this

    const openPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveItem(kwargs, resolve, reject))
    })

    openPromise.then((data) => {
      console.log('DATAAAA', data)
      alertify.alert('COMPLETADO', 'Caja Abierta Correctamente')
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data)
        alertify.alert('Error', `Ocurrió un error al abrir la caja, ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
      } else {
        console.log('NO CUSTOM ERROR')
        console.log(err)
        alertify.alert('Error', `Ocurrió un error al abrir la caja, ERROR: ${err}.`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_CASHIER_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render () {

    let crcTotals = this.props.openTotalCRC
    let usdTotals = this.props.openTotalUSD

    if(this.props.byNotes){
      crcTotals = getTotalAmount(this.props.openBillList, 'CRC')
      usdTotals = getTotalAmount(this.props.openBillList, 'USD')
    }

    return <div>
      <h1>TOTALES APERTURA</h1>
      <h2> APERTURA COLONES</h2>
      <div className='cashier-aside-tag'>
        ₡ {parseFloat(crcTotals).formatMoney()}
      </div>
      <h2>APERTURA DÓLARES</h2>
      <div className='cashier-aside-tag'>
        $ {parseFloat(usdTotals).formatMoney()}
      </div>
      <button onClick={this.openRegister.bind(this)} className='btn btn-success'>ABRIR CAJA</button>
    </div>
  }

}
