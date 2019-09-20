/*
 * Module dependencies
 */
import React from 'react'

import Client from '../../../../sales/general/clients/clients.jsx'
import Notes from '../../../../sales/general/extras/notes.jsx'
import Totals from '../../../../sales/general/totals/totals.jsx'
// import ButtonsExtras from '../buttons/buttonsExtras.jsx'
import MainButtons from '../buttons/buttonsMain.jsx'
import Currency from '../../../../sales/general/currency/currency.jsx'
// import PriceList from '../../general/priceList/priceList.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.freenote.fullWidth,
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
    const asideClass = this.props.fullWidth ? 'freenote-aside collapsed' : 'freenote-aside'
    const asideContainerClass = this.props.fullWidth ? 'freenote-aside-content collapsed' : 'freenote-aside-content'

    return <div className={asideClass}>
      <div className={asideContainerClass}>
        <h1>NOTA LIBRE:</h1>
        <Client />
        <Currency />
        {/* <RelatedFields /> */}
        <Totals key='sales' />
        <Notes />
        <MainButtons />
        {/* <div className='freenote-aside-arrow'>
          <div className='freenote-aside-arrow-container' onClick={this.toggleWidth.bind(this)}>
            <i className='fa fa-chevron-right' />
          </div>
        </div> */}
        {/* <Client />
        <PriceList />
        <Currency />
        <Totals />
        <Notes />
        <Buttons /> */}
      </div>
      {/* <Buttons /> */}
      <div className='freenote-aside-total' >
        {symbol} {this.props.total.formatMoney()}
        <i className='fa fa-chevron-right' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>
  }

}
