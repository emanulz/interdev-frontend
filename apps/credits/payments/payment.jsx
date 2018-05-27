/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { setItem } from '../../../utils/api.js'

@connect((store) => {
  return {
    payment: store.payments.paymentActive
  }
})

export default class MovementsList extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_PAYMENT', payload: ''})

    const lookUp = this.props.location.pathname.split('/').pop()

    const kwargs = {
      lookUpField: 'consecutive',
      url: '/api/creditpayments/',
      lookUpValue: lookUp,
      dispatchType: 'SET_PAYMENT',
      dispatchType2: 'SET_PAYMENT_OLD',
      dispatchErrorType: 'PAYMENT_NOT_FOUND',
      lookUpName: 'Numéro de pago',
      modelName: 'Pagos',
      redirectUrl: '/credits/payments',
      history: this.props.history
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(setItem(kwargs))
  }

  showInvoice() {
    this.props.dispatch({type: 'SHOW_INVOICE_PANEL', payload: ''})
  }

  saleItem(sale) {

    const date = new Date(sale.sale.created)

    return <tr key={sale.sale.id}>
      <td>{sale.sale.consecutive}</td>
      <td>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</td>
      <td>₡ {parseFloat(sale.sale.cart.cartTotal).formatMoney(2, ',', '.')}</td>
      <td>₡ {parseFloat(sale.amount).formatMoney(2, ',', '.')}</td>
      <td>₡ {parseFloat(sale.sale.debt).formatMoney(2, ',', '.')}</td>
      <td>₡ {(parseFloat(sale.sale.debt) - parseFloat(sale.amount)).formatMoney(2, ',', '.')}</td>
    </tr>
  }

  // Render the product
  render() {
    const payment = this.props.payment

    const sales = payment.sales

    const rows = sales.length
      ? sales.map(sale => {
        return this.saleItem(sale)
      })
      : <tr>
        <td>NO HAY VENTAS EN EL PAGO</td>
      </tr>

    const amount = this.props.payment.amount ? parseFloat(this.props.payment.amount) : 0

    return <div className='list-container'>

      <h1>Pago a facturas #{payment.consecutive}</h1>
      <div className='row payment-single'>
        <div className='col-xs-12 col-sm-8'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Venta #</th>
                <th>Fecha de venta</th>
                <th>Total de la venta</th>
                <th>Monto Pagado</th>
                <th>Saldo Anterior</th>
                <th>Saldo Posterior</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
        <div className='payment-single-sidebar col-xs-12 col-sm-4'>
          <div className='col-xs-12'>
            <table className='table table-bordered'>
              <tbody>
                <tr>
                  <th>Monto del pago</th>
                  <td>₡ {amount.formatMoney(2, ',', '.')}</td>
                </tr>
              </tbody>
            </table>
            <button className='form-control btn btn-success' onClick={this.showInvoice.bind(this)} >
              Mostar recibo
              <i className='fa fa-credit-card' />
            </button>
          </div>
        </div>
      </div>

    </div>
  }
}
