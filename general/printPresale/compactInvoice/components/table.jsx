import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {sale: store.printPresale.presale}
})
export default class Table extends React.Component {

  // Main Layout
  render() {

    const cartItems = this.props.sale.cart ? this.props.sale.cart.cartItems : []
    const items = cartItems.map((item) => {

      const taxesText = (item.product.use_taxes || item.product.use_taxes2 || item.product.use_taxes3)
        ? `G`
        : `E`

      return <div className='print-compact-presale-table-body-item' key={item.uuid}>
        <div className='print-compact-presale-table-body-item-description'>
          {item.product.description}
        </div>
        <div className='print-compact-presale-table-body-item-data'>
          <div className='print-compact-presale-table-body-item-data-qty'>
            {item.qty}
          </div>
          <div className='print-compact-presale-table-body-item-data-code'>
            {item.product.code}
          </div>
          <div className='print-compact-presale-table-body-item-data-iv'>
            {taxesText}
          </div>
          <div className='print-compact-presale-table-body-item-data-total'>
            ₡ {item.subTotalNoDiscount.formatMoney(2, ',', '.')}
          </div>
        </div>
      </div>
    })

    return <div className='print-compact-presale-table'>
      <div className='print-compact-presale-table-header'>
        <div className='print-compact-presale-table-header-qty'>Cant</div>
        <div className='print-compact-presale-table-header-code'>Código</div>
        <div className='print-compact-presale-table-header-iv'>IV</div>
        <div className='print-compact-presale-table-header-total'>Total</div>
      </div>
      <div className='print-compact-presale-table-body'>
        {items}
      </div>

    </div>

  }

}
