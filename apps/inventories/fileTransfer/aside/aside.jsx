/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

import Client from '../clients/clients.jsx'
import Buttons from '../buttons/button.jsx'
import Notes from '../../../sales/general/extras/notes.jsx'

import WarehouseMulti from '../../../../general/warehouse_multi/warehouse.jsx'

@connect((store) => {
  return {
    fullWidth: store.fileTransfer.fullWidth,
    total: store.cart.cartTotal,
    currencySymbol: store.currency.symbolSelected,
    transfer_mode: store.fileTransfer.transfer_mode
  }
})
export default class Aside extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH'})
  }
  
  // Main Layout
  render () {
    const symbol = "₡"
    const asideClass = this.props.fullWidth ? 'sale-aside collapsed' : 'sale-aside'
    const asideContainerClass = this.props.fullWidth ? 'sale-aside-content collapsed' : 'sale-aside-content'
    let warehouse_origin = ''
    if(this.props.transfer_mode == "OUTPUT" || this.props.transfer_mode == "TRANSFER" || this.props.transfer_mode == "FILE"){
      warehouse_origin = <WarehouseMulti namespace="transfer_origin" placeholder='Elija la bodega origen...' label="Bodega de origen:"/>
    }
    let warehouse_destination = ''
    if(this.props.transfer_mode == "INPUT" || this.props.transfer_mode == "TRANSFER"){
      warehouse_destination = <WarehouseMulti namespace="transfer_destiny" placeholder='Elija la bodega destino...' label="Bodega de destino:"/>
    }

    return <div className={asideClass}>
      <div className={asideContainerClass}>
        <Client />
        <Notes />
        {warehouse_origin}
        <hr/>
        {warehouse_destination}
        <Buttons />
      </div>
      <div className='sale-aside-total' >
        {symbol} {this.props.total.formatMoney()}
        <i className='fa fa-chevron-right' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>
  }

}
