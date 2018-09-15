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
      const item = cartItems.find(inner => {
        if (itemInner.uuid) {
          return inner.uuid == itemInner.uuid
        }
        if (itemInner.id) {
          return inner.product.id == itemInner.id
        }
      })
      const taxesText = (item.product.use_taxes || item.product.use_taxes2 || item.product.use_taxes3)
        ? `G`
        : `E`
      const total = (parseFloat(item.totalWithIv) / parseFloat(item.qty)) * parseFloat(itemInner.ret_qty)
      return <tr key={item.uuid}>
        <td>
          {item.product.code}
        </td>
        <td>
          {item.product.description}
        </td>
        <td className='right-in-table'>
          {itemInner.ret_qty}
        </td>
        <td>
          {taxesText}
        </td>
        <td className='right-in-table'>
          ₡ {total.formatMoney(2, ',', '.')}
        </td>
      </tr>
    })

    const globalDiscountRow = this.props.globalDiscount ? <th className='right-in-table'>Des2 %</th>
      : <th style={{'display': 'none'}} >-</th>

    return <table className='print-return-full-invoice-table table'>
      <thead>
        <tr>
          <th>Código</th>
          <th className='description-row'>Descripción</th>
          <th className='right-in-table'>Cantidad</th>
          <th className='right-in-table'>IV</th>
          <th className='right-in-table'>Total</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </table>

  }

}
