/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

import Client from '../clients/clients.jsx'
import Buttons from '../buttons/button.jsx'
import Notes from '../../../sales/general/extras/notes.jsx'

import Warehouse from '../../../../general/warehouses/warehouse.jsx'

@connect((store) => {
  return {
    fullWidth: store.fileTransfer.fullWidth,
    total: store.cart.cartTotal,
    currencySymbol: store.currency.symbolSelected
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
    return <div className={asideClass}>
      <div className={asideContainerClass}>
        <Client />
        <Notes />
        <Warehouse />
        <Buttons />
      </div>
      <div className='sale-aside-total' >
        {symbol} {this.props.total.formatMoney()}
        <i className='fa fa-chevron-right' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>
  }

}
