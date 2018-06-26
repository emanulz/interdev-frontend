import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.sales.saleActive
  }
})
export default class WorkOrderData extends React.Component {

  render() {

    // BILL DATA

    let workOrderData = ''
    let workOrderNumber = '00'
    let article = ''
    let articleBrand = ''
    let workOrderId = false
    try {
      workOrderData = JSON.parse(this.props.sale.cart.work_order)
      workOrderNumber = workOrderData.work_order.consecutive || ''
      article = workOrderData.work_order.article_type || ''
      articleBrand = workOrderData.work_order.article_brand || ''
      workOrderId = this.props.sale.cart.work_order_id
    } catch (err) {}
    const ret = workOrderId
      ? <div className='compact-invoice-data'>
        <div className='compact-invoice-separator'>
          <span />

          <h1>CIERRE DE TALLER</h1>

          <span />
        </div>

        <table className='datenum-table'>
          <tbody>
            <tr>
              <th># De orden:</th>
              <td>{workOrderNumber}</td>
            </tr>
            <tr>
              <th>Articulo:</th>
              <td>{article}</td>
            </tr>
            <tr>
              <th>Marca:</th>
              <td>{articleBrand}</td>
            </tr>

          </tbody>

        </table>
      </div>
      : <div />

    // RETURN BLOCK
    return ret

  }

}
