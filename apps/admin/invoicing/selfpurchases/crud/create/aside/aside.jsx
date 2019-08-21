/*
 * Module dependencies
 */
import React from 'react'

// import Client from '../../general/clients/clients.jsx'
import Notes from '../../../../../../sales/general/extras/notes.jsx'
import Totals from '../../../../../../sales/general/totals/totals.jsx'
// import ButtonsExtras from '../buttons/buttonsExtras.jsx'
import MainButtons from '../buttons/buttonsMain.jsx'
import Currency from '../../../../../../sales/general/currency/currency.jsx'
import RelatedFields from '../relatedFields/relatedFields.jsx'
// import PriceList from '../../general/priceList/priceList.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    fullWidth: store.selfpurchase.fullWidth,
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
    const asideClass = this.props.fullWidth ? 'selfpurchase-aside collapsed' : 'selfpurchase-aside'
    const asideContainerClass = this.props.fullWidth ? 'selfpurchase-aside-content collapsed' : 'selfpurchase-aside-content'

    return <div className={asideClass}>
      <div className={asideContainerClass}>
        <Currency />
        <RelatedFields />
        <Totals key='sales' />
        <Notes />
        <MainButtons />
        {/* <div className='selfpurchase-aside-arrow'>
          <div className='selfpurchase-aside-arrow-container' onClick={this.toggleWidth.bind(this)}>
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
      <div className='selfpurchase-aside-total' >
        {symbol} {this.props.total.formatMoney()}
        <i className='fa fa-chevron-right' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>
  }

}
