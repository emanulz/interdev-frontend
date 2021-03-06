import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
import alertify from 'alertifyjs'
// import alertify from 'alertifyjs'
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

  selectClientDEPRECATED(event) {
    event.preventDefault()
    const target = event.target
    const value = target.value

    const clients = [
      ...this.props.clients
    ]

    const clientSelected = clients.filter(client => {
      return client.id == value
    })

    this.props.dispatch({type: 'SET_CLIENT', payload: clientSelected[0]})
  }

  unselectClient() {
    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT_SALES_WITH_DEBT', payload: ''})
    this.props.dispatch({type: 'CLEAR_PAYMENT_ARRAY', payload: ''})
  }

  paySaleComplete(sale, event) {

    this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: sale.id})
    document.getElementById(`${sale.id}-checkbox-partial`).checked = false
    document.getElementById(`${sale.id}-input-partial`).value = ''

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
      if (this.props.creditPayMethod == 'VOUCHER') {
        const voucherBalance = voucherAmount - prevAmount - Math.abs(parseFloat(sale.balance))
        if (voucherBalance < -1) {
          alertify.alert('ERROR', 'El monto a pagar es mayor que el disponible en vouchers.')
          document.getElementById(`${sale.id}-checkbox-complete`).checked = false
          return false
        }
      }
      const item = {
        bill_id: sale.id,
        sale: sale,
        amount: Math.abs(parseFloat(sale.balance)),
        complete: true,
        type: sale.type
      }
      this.props.dispatch({type: 'ADD_TO_PAYMENT_ARRAY', payload: item})

    } else {
      this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: sale.id})
    }
  }

  paySaleAmount(sale, event) {

    this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: sale.id})

    document.getElementById(`${sale.id}-checkbox-complete`).checked = false

    if (event.target.checked) {
      const item = {
        bill_id: sale.id,
        sale: sale,
        amount: 0,
        complete: false,
        type: sale.type
      }
      this.props.dispatch({type: 'ADD_TO_PAYMENT_ARRAY', payload: item})

    } else {
      this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: sale.id})
    }
  }

  setPaySaleAmount(sale, event) {

    // CALC THE EXISTENT PAYMENT
    const array = [...this.props.paymentArray]
    let prevAmountNoThisSale = 0
    // CALC THE TOTAL AMOUNT OF PAYMENT NOT INCLUDING THIS SALE
    array.map(item => {
      if (item.bill_id != sale.id) {
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
        document.getElementById(`${sale.id}-checkbox-partial`).checked = false
        document.getElementById(`${sale.id}-input-partial`).value = ''
        this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: sale.id})
        return false
      }
    }

    this.props.dispatch({type: 'SET_AMOUNT_PAYMENT_ARRAY', payload: {amount: value, sale: sale}})
  }

  paymentTableItem(sale) {

    const date = formatDate(sale.created)
    const typeText = sale.type == 'SALE' ? 'FACTURA DE VENTA' : sale.type == 'PRESALE' ? 'APARTADO' : ''
    return <tr key={`${sale.consecutive}_${sale.type}`}>
      <td>{sale.consecutive}</td>
      <td>{date}</td>
      <td>₡ {sale.sale_total ? parseFloat(sale.sale_total).formatMoney(2, ',', '.') : 0}</td>
      <td>₡ {Math.abs(parseFloat(sale.balance)) ? Math.abs(parseFloat(sale.balance)).formatMoney(2, ',', '.') : 0}</td>
      <td>{typeText}</td>
      <td>
        <input
          id={`${sale.id}-checkbox-complete`}
          type='checkbox'
          onClick={this.paySaleComplete.bind(this, sale)}
        />
      </td>
      <td>
        <input
          id={`${sale.id}-checkbox-partial`}
          type='checkbox'
          onClick={this.paySaleAmount.bind(this, sale)}
        />
      </td>
      <td>
        <input
          id={`${sale.id}-input-partial`}
          type='number'
          onChange={this.setPaySaleAmount.bind(this, sale)}
        />
      </td>
    </tr>
  }

  saveMovements() {
    // ITEMS USED BY PAYMENT OBJECT
    const array = [...this.props.paymentArray]
    // const user = JSON.stringify(this.props.user)
    // const client = JSON.stringify(this.props.client)
    const sales = JSON.stringify(this.props.paymentArray)
    const clientId = this.props.client.id
    const creditPayMethod = this.props.creditPayMethod

    // const newSales = array.map(sale => {
    //   return {
    //     amount: sale.amount,
    //     bill_id: sale.bill_id,
    //     sale
    //   }
    // })

    let amount = 0

    // CALC THE TOTAL AMOUNT OF PAYMENT
    array.map(item => {
      amount = amount + item.amount
    })

    const payment = {
      sales: sales,
      client_id: clientId,
      amount: amount,
      pay_method: creditPayMethod
    }

    console.log('PAYMENT', payment)

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
      console.log(data)
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

    const sales = this.props.clientActiveSalesWithDebt
    sales.sort((a, b) => {
      return new Date(a.created) - new Date(b.created)
    })

    const rows = sales.length
      ? sales.map(sale => {
        return this.paymentTableItem(sale)
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
        <h3>Disponible: ₡{voucherAmount.formatMoney(2, ',', '.')}</h3>
        <h3>Restante: ₡{(voucherAmount - paymentTotal).formatMoney(2, ',', '.')}</h3>
      </div>
      : <div />

    return <div className='payment'>
      <h1>Registrar pago a Facturas:</h1>

      <div className='payment-header'>
        <div className='payment-header-client'>
          <h1>CLIENTE: {client.code} - {client.name} {client.last_name}</h1>
        </div>
        <div className='payment-header-container'>
          <div className='payment-header-container-totals'>
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
          </div>

          <div className='payment-header-container-btn'>

            <h1>Método de Pago</h1>
            <select onChange={this.setCreditPayMethod.bind(this)} className='form-control' name='pay_method'
              value={this.props.creditPayMethod} >
              <option value='CASH'>EFECTIVO</option>
              <option value='CARD'>TARJETA</option>
              <option value='TRANSFER'>TRANSFERENCIA</option>
              <option value='VOUCHER'>VOUCHER DE CRÉDITO</option>
            </select>
            {availableVouchersDiv}

            <button onClick={this.saveMovements.bind(this)} disabled={!this.props.paymentArray.length} className='form-control'>
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
              <th>Otro</th>
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
