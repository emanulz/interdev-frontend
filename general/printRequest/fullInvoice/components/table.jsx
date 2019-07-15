import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {sale: store.printRequest.request}
})
export default class Table extends React.Component {

  // Main Layout
  render() {

    const cartItems = this.props.sale.cart ? this.props.sale.cart.cartItems : []
    const items = cartItems.length
      ? cartItems.map((item) => {

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
        </tr>
      })
      : <tr>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

    return <table className='reprint-full-request-table table'>
      <thead>
        <tr>
          <th>Código</th>
          <th className='description-row'>Descripción</th>
          <th className='right-in-table'>Cantidad</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </table>

  }

}
