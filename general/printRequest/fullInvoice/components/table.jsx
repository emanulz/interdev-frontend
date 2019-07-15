import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {sale: store.printOrder.order}
})
export default class Table extends React.Component {

  // Main Layout
  render() {

    const cartItems = this.props.sale.cart ? this.props.sale.cart.cartItems : []
    const items = cartItems.length
      ? cartItems.map((item) => {

        const taxesText = item.product.taxes_IVA ? `${parseFloat(item.product.taxes_IVA).toFixed(0)}%` : ''

        return <tr key={item.uuid}>
          <td>
            {item.product.code}
          </td>
          <td>
            {item.product.description}
          </td>
          <td className='right-in-table'>
            {item.qty}
          </td>
          <td className='right-in-table'>
            ₡ {parseFloat(item.priceToUse).formatMoney(2, ',', '.')}
          </td>
          <td className='right-in-table'>
            {item.discount}
          </td>
          <td className='right-in-table'>
            {taxesText}
          </td>
          <td className='right-in-table'>
            ₡ {item.subTotalNoDiscount.formatMoney(2, ',', '.')}
          </td>
        </tr>
      })
      : <tr>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

    return <table className='reprint-full-order-table table'>
      <thead>
        <tr>
          <th>Código</th>
          <th className='description-row'>Descripción</th>
          <th className='right-in-table'>Cantidad</th>
          <th className='right-in-table'>P.U</th>
          <th className='right-in-table'>Des%</th>
          <th className='right-in-table'>IVA</th>
          <th className='right-in-table'>Precio</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </table>

  }

}
