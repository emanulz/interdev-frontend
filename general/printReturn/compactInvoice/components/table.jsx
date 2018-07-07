import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {returnObject: store.printReturn.return_object}
})
export default class Table extends React.Component {

  // Main Layout
  render() {

    const cartItems = this.props.returnObject.sale_cart ? this.props.returnObject.sale_cart.cartItems : []
    const returnItems = this.props.returnObject.return_list ? this.props.returnObject.return_list : []

    const items = returnItems.map((itemInner) => {
      const item = cartItems.find(inner => { return inner.product.id == itemInner.id })
      const taxesText = (item.product.use_taxes || item.product.use_taxes2 || item.product.use_taxes3)
        ? `G`
        : `E`
      const total = (parseFloat(item.totalWithIv) / parseFloat(item.qty)) / parseFloat(itemInner.ret_qty)
      return <div className='print-return-compact-invoice-table-body-item' key={item.uuid}>
        <div className='print-return-compact-invoice-table-body-item-description'>
          {item.product.description}
        </div>
        <div className='print-return-compact-invoice-table-body-item-data'>
          <div className='print-return-compact-invoice-table-body-item-data-qty'>
            {itemInner.ret_qty}
          </div>
          <div className='print-return-compact-invoice-table-body-item-data-code'>
            {item.product.code}
          </div>
          <div className='print-return-compact-invoice-table-body-item-data-iv'>
            {taxesText}
          </div>
          <div className='print-return-compact-invoice-table-body-item-data-total'>
            ₡ {total.formatMoney(2, ',', '.')}
          </div>
        </div>
      </div>
    })

    return <div className='print-return-compact-invoice-table'>
      <div className='print-return-compact-invoice-table-header'>
        <div className='print-return-compact-invoice-table-header-qty'>Cant</div>
        <div className='print-return-compact-invoice-table-header-code'>Código</div>
        <div className='print-return-compact-invoice-table-header-iv'>IV</div>
        <div className='print-return-compact-invoice-table-header-total'>Total</div>
      </div>
      <div className='print-return-compact-invoice-table-body'>
        {items}
      </div>

    </div>

  }

}
