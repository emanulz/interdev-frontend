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
    openTotalCRC: store.cashier.openTotalCRC,
    openTotalUSD: store.cashier.openTotalUSD,
    openTotalCRCSetted: store.cashier.openTotalCRCSetted,
    openTotalUSDSetted: store.cashier.openTotalUSDSetted,
    openBillList: store.cashier.openBillList,
    registerClosure: store.registerClosure.registerClosure,
    closureCardTotalCRC: store.cashier.closureCardTotalCRC,
    closureTransferTotalCRC: store.cashier.closureTransferTotalCRC
  }
})
export default class Open extends React.Component {

  showReceipt() {
    console.log('CLICKED')
    this.props.dispatch(loadRegisterClosureToPrint(this.props.registerClosure.id))
  }

  closeRegister() {
    // HERE CALCULATE DEPENDS OF WETHER IS AMOUNT SETED OR BILLS USED
    let crcTotals = 0
    let usdTotals = 0

    if (this.props.openTotalCRCSetted) {
      crcTotals = this.props.openTotalCRC
    } else {
      crcTotals = getTotalAmount(this.props.openBillList, 'CRC')
    }
    if (this.props.openTotalUSDSetted) {
      usdTotals = this.props.openTotalUSD
    } else {
      usdTotals = getTotalAmount(this.props.openBillList, 'USD')
    }

    const _this = this
    alertify.confirm('CERRAR', `Desea cerrar la caja con un monto de Efectivo de ₡${parseFloat(crcTotals).formatMoney()} y $${parseFloat(usdTotals).formatMoney()}`,
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
      closure_money_crc_cashier_card: parseFloat(this.props.closureCardTotalCRC),
      closure_money_usd_cashier_card: 0,
      closure_money_crc_cashier_transfer: parseFloat(this.props.closureTransferTotalCRC),
      closure_money_usd_cashier_transfer: 0,
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

    let crcTotals = 0
    let usdTotals = 0

    if (this.props.openTotalCRCSetted) {
      crcTotals = this.props.openTotalCRC
    } else {
      crcTotals = getTotalAmount(this.props.openBillList, 'CRC')
    }
    if (this.props.openTotalUSDSetted) {
      usdTotals = this.props.openTotalUSD
    } else {
      usdTotals = getTotalAmount(this.props.openBillList, 'USD')
    }

    const clusureCashCRC = this.props.registerClosure ? this.props.registerClosure.closure_money_crc_system_cash : 0
    const crcBalance = parseFloat(crcTotals) - parseFloat(clusureCashCRC)
    const crcBalanceTag = crcBalance >= 0 ? 'green' : 'red'

    const clusureCashUSD = this.props.registerClosure ? this.props.registerClosure.closure_money_usd_system_cash : 0
    const usdBalance = parseFloat(usdTotals) - parseFloat(clusureCashUSD)
    const usdBalanceTag = usdBalance >= 0 ? 'green' : 'red'
    // logic to hide dolars if not present
    const hideItemUSD = (usdTotals == 0 && clusureCashUSD == 0) ? 'hideTag' : ''

    const cardTotals = this.props.closureCardTotalCRC
    const clusureCardCRC = this.props.registerClosure ? this.props.registerClosure.closure_money_crc_system_card : 0
    const crcCardBalance = parseFloat(cardTotals) - parseFloat(clusureCardCRC)
    const crcCardBalanceTag = crcCardBalance >= 0 ? 'green' : 'red'

    const transferTotals = this.props.closureTransferTotalCRC
    const clusureTransferCRC = this.props.registerClosure ? this.props.registerClosure.closure_money_crc_system_transfer : 0
    const crcTransferBalance = parseFloat(transferTotals) - parseFloat(clusureTransferCRC)
    const crcTransferBalanceTag = crcTransferBalance >= 0 ? 'green' : 'red'
    // logic to hide dolars if not present
    const hideItemTransfer = (transferTotals == 0 && clusureTransferCRC == 0) ? 'hideTag' : ''

    return <div>
      <h1>TOTALES:</h1>
      <h2>EFECTIVO COLONES</h2>
      <div className='cashier-aside-group'>
        <div className='cashier-aside-group-tag'>
          <h2>Sistema</h2>
          <h1>₡ {parseFloat(clusureCashCRC).formatMoney()}</h1>
        </div>
        <div className='cashier-aside-group-tag'>
          <h2>Cajero</h2>
          <h1>₡ {parseFloat(crcTotals).formatMoney()}</h1>
        </div>
        <div className={`cashier-aside-group-tag ${crcBalanceTag}`}>
          <h2>Balance</h2>
          <h1>₡ {parseFloat(crcBalance).formatMoney()}</h1>
        </div>
      </div>
      <hr />

      <h2 className={`${hideItemUSD}`}>SISTEMA EFECTIVO DÓLARES</h2>
      <div className={`cashier-aside-group ${hideItemUSD}`}>
        <div className={`cashier-aside-group-tag ${hideItemUSD}`}>
          <h2>Sistema</h2>
          <h1>$ {parseFloat(clusureCashUSD).formatMoney()}</h1>
        </div>
        <div className='cashier-aside-group-tag'>
          <h2>Cajero</h2>
          <h1>$ {parseFloat(usdTotals).formatMoney()}</h1>
        </div>
        <div className={`cashier-aside-group-tag ${usdBalanceTag}`}>
          <h2>Balance</h2>
          <h1>$ {parseFloat(usdBalance).formatMoney()}</h1>
        </div>
      </div>
      <hr className={`${hideItemUSD}`} />

      <h2>TARJETAS COLONES</h2>
      <div className='cashier-aside-group'>
        <div className='cashier-aside-group-tag'>
          <h2>Sistema</h2>
          <h1>₡ {parseFloat(clusureCardCRC).formatMoney()}</h1>
        </div>
        <div className='cashier-aside-group-tag'>
          <h2>Cajero</h2>
          <h1>₡ {parseFloat(cardTotals).formatMoney()}</h1>
        </div>
        <div className={`cashier-aside-group-tag ${crcCardBalanceTag}`}>
          <h2>Balance</h2>
          <h1>₡ {parseFloat(crcCardBalance).formatMoney()}</h1>
        </div>
      </div>
      <hr className={`${hideItemTransfer}`} />

      <h2 className={`${hideItemTransfer}`}>SISTEMA TRANSFERENCIAS COLONES</h2>
      <div className={`cashier-aside-group ${hideItemTransfer}`}>
        <div className='cashier-aside-group-tag'>
          <h2>Sistema</h2>
          <h1>₡ {parseFloat(clusureTransferCRC).formatMoney()}</h1>
        </div>
        <div className='cashier-aside-group-tag'>
          <h2>Cajero</h2>
          <h1>₡ {parseFloat(transferTotals).formatMoney()}</h1>
        </div>
        <div className={`cashier-aside-group-tag ${crcTransferBalanceTag}`}>
          <h2>Balance</h2>
          <h1>₡ {parseFloat(crcTransferBalance).formatMoney()}</h1>
        </div>
      </div>
      <div className='cashier-aside-buttons'>
        <button onClick={this.closeRegister.bind(this)} className='btn btn-danger'>CERRAR CAJA</button>
        <button onClick={this.showReceipt.bind(this)} className='btn btn-primary'>MOSTRAR CIERRE</button>
      </div>
      <br />
    </div>
  }

}
