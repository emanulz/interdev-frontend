/*
 * Module dependencies
 */
import React from 'react'

import Client from '../../general/clients/clients.jsx'
import Notes from '../../general/extras/notes.jsx'
import Totals from '../../general/totals/totals.jsx'
import Buttons from '../buttons/buttons.jsx'
import Currency from '../../general/currency/currency.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.sale.fullWidth,
    total: store.cart.cartTotal,
    currencySymbol: store.currency.symbolSelected
  }
})
export default class Aside extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render () {
    const symbol = this.props.currencySymbol
    const asideClass = this.props.fullWidth ? 'sale-aside collapsed' : 'sale-aside'
    const asideContainerClass = this.props.fullWidth ? 'sale-aside-content collapsed' : 'sale-aside-content'
    return <div className={asideClass}>
      <div className={asideContainerClass}>
        {/* <div className='sale-aside-arrow'>
          <div className='sale-aside-arrow-container' onClick={this.toggleWidth.bind(this)}>
            <i className='fa fa-chevron-right' />
          </div>
        </div> */}
        <Client />
        <Currency />
        <Totals />
        <Notes />
        <Buttons />
      </div>
      {/* <Buttons /> */}
      <div className='sale-aside-total' >
        {symbol} {this.props.total.formatMoney()}
        <i className='fa fa-chevron-right' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>
  }

}
