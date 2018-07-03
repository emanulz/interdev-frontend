/*
 * Module dependencies
 */
import React from 'react'
import SaleItems from './saleItems.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    // defaultConfig: store.config.defaultSales,
    // userConfig: store.config.userSales,
    // productSearchpanelVisible: store.searchProducts.visible
  }
})
export default class Sale extends React.Component {

  // Main Layout
  render() {

    return <div className='cart'>
      <div className='cart-header'>
        <div className='cart-header-code'>
          <h5>Cód</h5>
        </div>
        <div className='cart-header-description'>
          <h5>Art</h5>
        </div>
        <div className='cart-header-qty'>
          <h5>Cant</h5>
        </div>
        <div className='cart-header-total'>
          <h5>Total IVI</h5>
        </div>
      </div>

      <SaleItems />

    </div>

  }

}
