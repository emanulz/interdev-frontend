/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {setItem, generalSave} from '../../../utils/api.js'
import alertify from 'alertifyjs'

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
      url: '/api/creditpaymentslist/',
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

  confirmNull() {
    // ALERTIFY CONFIRM
    const _this = this
    const consecutive = this.props.payment.consecutive
    // CALC THE TOTAL AMOUNT OF PAYMENT
    alertify.confirm('ANULAR', `Desea Anular el pago #${consecutive}? Esto reversará todos los movimientos de pago realizados y sumará saldo al cliente.`,
      function() {
        _this.nullPayment()
      }, function() {
        return true
      }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  nullPayment() {
    const kwargs = {
      url: '/api/creditpaymentscreate/nullpayment/',
      data: {id: this.props.payment.id},
      method: 'post',
      sucessMessage: `Pago anulado Correctamente.`,
      errorMessage: `Hubo un error al anular el pago.`,
      successType: 'FETCHING_DONE',
      errorType: 'FETCHING_DONE'
    }

    this.props.dispatch({type: 'FETCHING_STARTED'})
    this.props.dispatch(generalSave(kwargs))
  }

  saleItem(item) {
    const saleObjectToUse = item.sale ? item.sale : item.presale ? item.presale : item
    const date = new Date(saleObjectToUse.created)
    const typeText = item.sale ? 'FACTURA DE VENTA' : item.presale ? 'APARTADO' : 'MOVIMIENTO MANUAL'
    return <tr key={item.id}>
      <td>{saleObjectToUse.consecutive}</td>
      <td>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</td>
      <td>₡ {parseFloat(saleObjectToUse.sale_total).formatMoney(2, ',', '.')}</td>
      <td>{typeText}</td>
      <td>₡ {parseFloat(item.amount).formatMoney(2, ',', '.')}</td>
      <td>₡ {Math.abs(parseFloat(item.previous_balance)).formatMoney(2, ',', '.')}</td>
      <td>₡ {(Math.abs(parseFloat(item.previous_balance)) - parseFloat(item.amount)).formatMoney(2, ',', '.')}</td>
    </tr>
  }

  // Render the product
  render() {
    const payment = this.props.payment

    const movements = payment.movements

    const rows = movements.length
      ? movements.map(sale => {
        return this.saleItem(sale)
      })
      : <tr>
        <td>NO HAY VENTAS EN EL PAGO</td>
      </tr>

    const amount = this.props.payment.amount ? parseFloat(this.props.payment.amount) : 0
    const statusText = this.props.payment.is_null ? 'ANULADO' : 'APLICADO'
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
                <th>Tipo</th>
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
                  <th>Estado del pago</th>
                  <td>{statusText}</td>
                </tr>
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
            <button disabled={this.props.payment.is_null} className='btnPaymentNull form-control btn btn-danger' 
              onClick={this.confirmNull.bind(this)}>
              Anular Pago
              <i className='fa fa-minus-circle' />
            </button>
          </div>
        </div>
      </div>

    </div>
  }
}
