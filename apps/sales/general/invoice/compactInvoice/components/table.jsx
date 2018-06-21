import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {inCart: store.cart.cartItems, globalDiscount: store.cart.globalDiscount}
})
export default class Table extends React.Component {

  // Main Layout
  render() {

    const cartItems = this.props.inCart
    const items = cartItems.map((item) => {

      const taxesText = (item.product.use_taxes || item.product.use_taxes2 || item.product.use_taxes3)
        ? `G`
        : `E`

      return <div className='compact-invoice-table-body-item' key={item.uuid}>
        <div className='compact-invoice-table-body-item-description'>
          {item.product.description}
        </div>
        <div className='compact-invoice-table-body-item-data'>
          <div className='compact-invoice-table-body-item-data-qty'>
            {item.qty}
          </div>
          <div className='compact-invoice-table-body-item-data-code'>
            {item.product.code}
          </div>
          <div className='compact-invoice-table-body-item-data-iv'>
            {taxesText}
          </div>
          <div className='compact-invoice-table-body-item-data-total'>
            ₡ {item.subTotalNoDiscount.formatMoney(2, ',', '.')}
          </div>
        </div>
      </div>
    })

    return <div className='compact-invoice-table'>
      <div className='compact-invoice-table-header'>
        <div className='compact-invoice-table-header-qty'>Cant</div>
        <div className='compact-invoice-table-header-code'>Código</div>
        <div className='compact-invoice-table-header-iv'>IV</div>
        <div className='compact-invoice-table-header-total'>Total</div>
      </div>
      <div className='compact-invoice-table-body'>
        {items}
      </div>

    </div>

  }

}
