/*
 * Module dependencies
 */
import React from 'react'

import Client from '../../../sales/general/clients/clients.jsx'
import Totals from '../../../sales/general/totals/totals.jsx'
import Notes from '../../../sales/general/extras/notes.jsx'
import Currency from '../../../sales/general/currency/currency.jsx'
import PriceList from '../../../sales/general/priceList/priceList.jsx'
import ButtonsExtras from '../buttons/buttonsExtras.jsx'
import MainButtons from '../buttons/buttonsMain.jsx'
import {connect} from 'react-redux'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs'

@connect((store) => {
  return {
    fullWidth: store.presale.fullWidth,
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
        <Tabs defaultTab='one'>
          <TabList>
            <Tab className='oneTwo' tabFor='one'>General</Tab>
            <Tab className='oneTwo' tabFor='two'>Extras</Tab>
            <TabPanel tabId='one'>
              <Client />
              <PriceList />
              <Currency />
              <Totals />
              <MainButtons />
            </TabPanel>

            <TabPanel tabId='two'>
              <Notes />
              <ButtonsExtras />
            </TabPanel>
          </TabList>
        </Tabs>
        {/* <Client />
        <PriceList />
        <Currency />
        <Totals />
        <Notes />
        <Buttons /> */}
      </div>
      {/* <Buttons /> */}
      <div className='sale-aside-total' >
        {symbol} {this.props.total.formatMoney()}
        <i className='fa fa-chevron-right' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>
  }

}
