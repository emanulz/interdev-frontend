import React from 'react'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
import {setItem} from '../../../utils/api'
import {getClientPendingSales} from '../../../utils/getClientPendingSales.js'
import {formatDate} from '../../../utils/formatDate.js'
import {savePayment, getClientVouchers} from './actions.js'

@connect((store) => {
  return {
    paymentArray: store.payments.paymentArray,
    clients: store.clients.clients,
    client: store.clients.clientActive,
    user: store.user.user,
    clientActiveSalesWithDebt: store.unpaidSales.clientActiveSalesWithDebt,
    creditPayMethod: store.payments.creditPayMethod,
    creditPayNotes: store.payments.creditPayNotes,
    clientVouchers: store.payments.clientVouchers
  }
})
export default class Update extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT_SALES_WITH_DEBT', payload: ''})
    this.props.dispatch({type: 'CLEAR_PAYMENT_ARRAY', payload: ''})

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const lookUp = this.props.location.pathname.split('/').pop()

    const kwargs = {
      lookUpField: 'code',
      url: '/api/clients/',
      lookUpValue: lookUp,
      dispatchType: 'SET_CLIENT',
      dispatchType2: 'SET_CLIENT_OLD',
      dispatchErrorType: 'CLIENT_NOT_FOUND',
      lookUpName: 'código',
      modelName: 'Clientes',
      redirectUrl: '/admin/clients',
      history: this.props.history
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(setItem(kwargs))

    // *******************************************************************
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.client.id != '0000000000' && nextprops.client.id != this.props.client.id) {

      const id = nextprops.client.id
      const code = nextprops.client.code
      const kwargs = {
        url: `/api/creditpaymentslist/get_client_bills/?code=${code}`,
        clientId: id,
        successType: 'FETCH_CLIENT_SALES_WITH_DEBT_FULFILLED',
        errorType: 'FETCH_CLIENT_SALES_WITH_DEBT_REJECTED'
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(getClientPendingSales(kwargs))
    }

  }

  setCreditPayMethod(ev) {
    this.props.dispatch({type: 'SET_CREDIT_PAY_METHOD', payload: ev.target.value})
    this.props.dispatch({type: 'CLEAR_CLIENT_VOUCHERS', payload: ''})

    if (ev.target.value == 'VOUCHER') {
      const id = this.props.client.id
      const kwargs = {
        url: `/api/clients/${id}`,
        successType: 'FETCH_CLIENT_VOUCHERS_FULFILLED',
        errorType: 'FETCH_CLIENT_VOUCHERS_REJECTED'
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(getClientVouchers(kwargs))
    }
  }

  setPaymentNotes(event) {
    this.props.dispatch({type: 'SET_CREDIT_PAY_NOTES', payload: event.target.value})
  }

  unselectClient() {
    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT_SALES_WITH_DEBT', payload: ''})
    this.props.dispatch({type: 'CLEAR_PAYMENT_ARRAY', payload: ''})
  }

  paySaleComplete(record, event) {

    this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: record.id})

    // CALC THE EXISTENT PAYMENT
    const array = [...this.props.paymentArray]
    let prevAmount = 0
    // CALC THE TOTAL AMOUNT OF PAYMENT
    array.map(item => {
      prevAmount = prevAmount + item.amount
    })
    // VOUCHER AMOUNT CALC
    let voucherAmount = 0
    if (this.props.clientVouchers.length) {
      this.props.clientVouchers.forEach(item => {
        voucherAmount += parseFloat(item.amount)
      })
    }

    if (event.target.checked) {
      document.getElementById(`${record.id}-input-partial`).value = Math.abs(parseFloat(record.balance))
      if (this.props.creditPayMethod == 'VOUCHER') {
        const voucherBalance = voucherAmount - prevAmount - Math.abs(parseFloat(record.balance))
        if (voucherBalance < -1) {
          alertify.alert('ERROR', 'El monto a pagar es mayor que el disponible en vouchers.')
          document.getElementById(`${record.id}-checkbox-complete`).checked = false
          return false
        }
      }
      const item = {
        record_id: record.id,
        record: record,
        amount: Math.abs(parseFloat(record.balance)),
        complete: true,
        type: record.type
      }
      this.props.dispatch({type: 'ADD_TO_PAYMENT_ARRAY', payload: item})

    } else {
      this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: record.id})
      document.getElementById(`${record.id}-input-partial`).value = ''
    }
  }

  setPaySaleAmount(record, event) {
    this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: record.id})
    // CALC THE EXISTENT PAYMENT
    const array = [...this.props.paymentArray]
    let prevAmountNoThisSale = 0
    // CALC THE TOTAL AMOUNT OF PAYMENT NOT INCLUDING THIS SALE
    array.map(item => {
      if (item.record_id != record.id) {
        prevAmountNoThisSale = prevAmountNoThisSale + item.amount
      }
    })
    // VOUCHER AMOUNT CALC
    let voucherAmount = 0
    if (this.props.clientVouchers.length) {
      this.props.clientVouchers.forEach(item => {
        voucherAmount += parseFloat(item.amount)
      })
    }

    const target = event.target
    const value = parseFloat(target.value)

    if (this.props.creditPayMethod == 'VOUCHER') {
      const voucherBalance = voucherAmount - prevAmountNoThisSale - value
      if (voucherBalance < -1) {
        alertify.alert('ERROR', 'El monto a pagar es mayor que el disponible en vouchers.')
        document.getElementById(`${record.id}-input-partial`).value = ''
        this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: record.id})
        return false
      }
    }
    const recordbalance = Math.abs(parseFloat(record.balance))
    if (value >= recordbalance) {
      const item = {
        record_id: record.id,
        record: record,
        amount: recordbalance,
        complete: true
      }
      this.props.dispatch({type: 'ADD_TO_PAYMENT_ARRAY', payload: item})
      document.getElementById(`${record.id}-checkbox-complete`).checked = true
      document.getElementById(`${record.id}-input-partial`).value = recordbalance
      document.getElementById(`${record.id}-input-partial`).blur()
    } else {
      const item = {
        record_id: record.id,
        record: record,
        amount: value,
        complete: false
      }
      this.props.dispatch({type: 'ADD_TO_PAYMENT_ARRAY', payload: item})
      document.getElementById(`${record.id}-checkbox-complete`).checked = false
    }

  }

  paymentTableItem(record) {
    const saleObjectToUse = record.sale ? record.sale : record.presale ? record.presale : record
    const date = formatDate(saleObjectToUse.created)
    const typeText = record.sale ? 'FACTURA DE VENTA' : record.presale ? 'APARTADO' : 'MOVIMIENTO MANUAL'
    return <tr key={`${record.id}_${record.type}`}>
      <td>{saleObjectToUse.consecutive}</td>
      <td>{date}</td>
      <td>₡ {record.total ? parseFloat(record.total).formatMoney(2, ',', '.') : 0}</td>
      <td>₡ {Math.abs(parseFloat(record.balance)) ? Math.abs(parseFloat(record.balance)).formatMoney(2, ',', '.') : 0}</td>
      <td>{typeText}</td>
      <td>
        <input
          id={`${record.id}-checkbox-complete`}
          type='checkbox'
          onClick={this.paySaleComplete.bind(this, record)}
        />
      </td>
      <td>
        <input
          id={`${record.id}-input-partial`}
          type='number'
          onChange={this.setPaySaleAmount.bind(this, record)}
        />
      </td>
    </tr>
  }

  confirmSave() {
    // ALERTIFY CONFIRM
    const _this = this
    const array = [...this.props.paymentArray]
    let amount = 0
    // CALC THE TOTAL AMOUNT OF PAYMENT
    array.map(item => {
      amount = amount + item.amount
    })
    alertify.confirm('REGISTRAR', `Desea Registrar el pago por un monto de ${parseFloat(amount).toFixed(2)}?`,
      function() {
        _this.saveMovements()
      }, function() {
        return true
      }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  saveMovements() {
    // ITEMS USED BY PAYMENT OBJECT
    const array = [...this.props.paymentArray]
    const records = JSON.stringify(this.props.paymentArray)
    const clientId = this.props.client.id
    const creditPayMethod = this.props.creditPayMethod

    let amount = 0

    // CALC THE TOTAL AMOUNT OF PAYMENT
    array.map(item => {
      amount = amount + item.amount
    })

    const payment = {
      records: records,
      client_id: clientId,
      amount: amount,
      pay_method: creditPayMethod,
      notes: this.props.creditPayNotes,
      type: 'DEBI'
    }

    const kwargs = {
      url: '/api/creditpaymentscreate/',
      item: payment
    }

    // MAKE "THIS" AVAILABLE FOR SUB-FUNCTIONS
    const _this = this

    const savePaymentPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(savePayment(kwargs, resolve, reject))
    })

    savePaymentPromise.then((data) => {
      this.props.dispatch({type: 'SET_PAYMENT', payload: data})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      this.props.dispatch({type: 'SHOW_INVOICE_PANEL', payload: ''})
      this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})
      this.props.dispatch({type: 'CLEAR_PAYMENT_ARRAY', payload: ''})
      this.props.dispatch({type: 'CLEAR_CLIENT_SALES_WITH_DEBT', payload: ''})
      alertify.alert('COMPLETADO', 'Pago Almacenado correctamente')

    }).catch((err) => {
      console.log(err)
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    }) // CATCH OF PAYMENT SAVE

  }

  render() {

    // ********************************************************************
    // CLIENTS FOR SELECT
    // ********************************************************************
    const client = this.props.client

    const records = this.props.clientActiveSalesWithDebt
    records.sort((a, b) => {
      return new Date(a.created) - new Date(b.created)
    })

    const rows = records.length
      ? records.map(record => {
        return this.paymentTableItem(record)
      })
      : this.props.client.code
        ? <tr>
          <td>SIN FACTURAS PENDIENTES</td>
        </tr>
        : <tr>
          <td>SELECCIONE UN CLIENTE</td>
        </tr>

    const clientDebt = Math.abs(parseFloat(this.props.client.balance))
    let paymentTotal = 0
    const array = this.props.paymentArray

    array.map(item => {
      paymentTotal = paymentTotal + item.amount
    })

    const amountLeft = clientDebt - paymentTotal
    let voucherAmount = 0
    if (this.props.clientVouchers.length) {
      this.props.clientVouchers.forEach(item => {
        voucherAmount += parseFloat(item.amount)
      })
    }
    const availableVouchersDiv = this.props.creditPayMethod == 'VOUCHER'
      ? <div className='vouchers-available'>
        <h3><span>Disponible:</span> ₡{voucherAmount.formatMoney(2, ',', '.')}</h3>
        <h3><span>Restante:</span> ₡{(voucherAmount - paymentTotal).formatMoney(2, ',', '.')}</h3>
      </div>
      : <div />

    return <div className='payment'>
      <h1>Registrar pago a Facturas:</h1>

      <div className='payment-header'>
        <div className='payment-header-client'>
          <h1>CLIENTE: {client.code} - {client.name} {client.last_name}</h1>
        </div>
        <div className='payment-header-container'>
          <div className='payment-header-container-pay-method'>
            <h1>Método de Pago</h1>
            <select onChange={this.setCreditPayMethod.bind(this)} className='form-control' name='pay_method'
              value={this.props.creditPayMethod} >
              <option value='CASH'>EFECTIVO</option>
              <option value='CARD'>TARJETA</option>
              <option value='TRANSFER'>TRANSFERENCIA</option>
              <option value='VOUCHER'>VOUCHER DE CRÉDITO</option>
            </select>
            {availableVouchersDiv}
            <h1>Notas:</h1>
            <textarea maxLength='250' rows='4' value={this.props.creditPayNotes} onChange={this.setPaymentNotes.bind(this)} />
          </div>

          <div className='payment-header-container-totals'>
            <h1>Totales:</h1>
            <table className='table table-bordered'>
              <tbody>
                <tr>
                  <th>Saldo Anterior</th>
                  <td>₡ {clientDebt.formatMoney(2, ',', '.')}</td>
                </tr>
                <tr>
                  <th>Este Abono:</th>
                  <td>₡ {paymentTotal.formatMoney(2, ',', '.')}</td>
                </tr>
                <tr>
                  <th>Saldo:</th>
                  <td>₡ {amountLeft.formatMoney(2, ',', '.')}</td>
                </tr>
              </tbody>
            </table>

            <button onClick={this.confirmSave.bind(this)} disabled={!this.props.paymentArray.length} className='form-control'>
              Registrar
            </button>

          </div>
        </div>
      </div>

      <div className='payment-table'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Fact #</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Deuda</th>
              <th>Tipo</th>
              <th>Completa</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>

    </div>

  }

}
