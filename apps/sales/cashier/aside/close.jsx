/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import {getTotalAmount} from '../content/actions.js'
import {loadRegisterClosureToPrint} from '../../../../general/printRegisterClosure/actions.js'
import { saveItem } from './actions'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    openBillList: store.cashier.openBillList,
    registerClosure: store.registerClosure.registerClosure
  }
})
export default class Open extends React.Component {

  showReceipt() {
    console.log('CLICKED')
    this.props.dispatch(loadRegisterClosureToPrint(this.props.registerClosure.id))
  }

  closeRegister() {

    const crcTotals = getTotalAmount(this.props.openBillList, 'CRC')
    const usdTotals = getTotalAmount(this.props.openBillList, 'USD')

    const _this = this
    alertify.confirm('ABRIR', `Desea cerrar la caja con un monto de ₡${parseFloat(crcTotals).formatMoney()} y $${parseFloat(usdTotals).formatMoney()}`,
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
    const registerClosure = {
      closure_money_crc_cashier: crc,
      closure_money_usd_cashier: usd,
      closure_notes: JSON.stringify(this.props.openBillList)
    }

    const kwargs = {
      url: '/api/registerclosure/close_register/',
      item: registerClosure
    }

    const _this = this

    const openPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveItem(kwargs, resolve, reject))
    })

    openPromise.then((data) => {
      console.log('DATAAAA', data)
      alertify.alert('COMPLETADO', 'Caja Cerrada Correctamente')
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data)
        alertify.alert('Error', `Ocurrió un error al cerrar la caja, ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
      } else {
        console.log('NO CUSTOM ERROR')
        console.log(err)
        alertify.alert('Error', `Ocurrió un error al cerrar la caja, ERROR: ${err}.`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_CASHIER_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render () {

    const crcTotals = getTotalAmount(this.props.openBillList, 'CRC')
    const usdTotals = getTotalAmount(this.props.openBillList, 'USD')
    const clusureCashCRC = this.props.registerClosure ? this.props.registerClosure.closure_money_crc_system_cash : 0
    const clusureCashUSD = this.props.registerClosure ? this.props.registerClosure.closure_money_usd_system_cash : 0
    return <div>
      <h1>TOTALES CIERRE</h1>
      <h2>CIERRE CAJERO COLONES</h2>
      <div className='cashier-aside-tag'>
        ₡ {parseFloat(crcTotals).formatMoney()}
      </div>
      <h2>CIERRE CAJERO DÓLARES</h2>
      <div className='cashier-aside-tag'>
        $ {parseFloat(usdTotals).formatMoney()}
      </div>
      <h2>CIERRE SISTEMA EFECTIVO COLONES</h2>
      <div className='cashier-aside-tag'>
        ₡ {parseFloat(clusureCashCRC).formatMoney()}
      </div>
      <h2>CIERRE SISTEMA EFECTIVO DÓLARES</h2>
      <div className='cashier-aside-tag'>
        $ {parseFloat(clusureCashUSD).formatMoney()}
      </div>
      <h2>BALANCE EFECTIVO COLONES</h2>
      <div className='cashier-aside-tag'>
        ₡ {(parseFloat(crcTotals) - parseFloat(clusureCashCRC)).formatMoney()}
      </div>
      <h2>BALANCE EFECTIVO DOLARES</h2>
      <div className='cashier-aside-tag'>
        $ {(parseFloat(usdTotals) - parseFloat(clusureCashUSD)).formatMoney()}
      </div>
      <button onClick={this.closeRegister.bind(this)} className='btn btn-danger'>CERRAR CAJA</button>
      <br/>
      <button onClick={this.showReceipt.bind(this)} className='btn btn-primary'>MOSTRAR CIERRE</button>
    </div>
  }

}