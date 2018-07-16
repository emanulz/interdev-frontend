import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
import alertify from 'alertifyjs'
// import alertify from 'alertifyjs'
import {getItemDispatch} from '../../../utils/api'
import {getClientPendingSales} from '../../../utils/getClientPendingSales.js'
import {formatDate} from '../../../utils/formatDate.js'
import {savePayment} from './actions.js'

@connect((store) => {
  return {
    paymentArray: store.payments.paymentArray,
    clients: store.clients.clients,
    client: store.clients.clientActive,
    user: store.user.user,
    clientActiveSalesWithDebt: store.unpaidSales.clientActiveSalesWithDebt
  }
})
export default class Update extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT_SALES_WITH_DEBT', payload: ''})
    this.props.dispatch({type: 'CLEAR_PAYMENT_ARRAY', payload: ''})

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const clientsKwargs = {
      url: '/api/clients/?limit=400',
      successType: 'FETCH_CLIENTS_FULFILLED',
      errorType: 'FETCH_CLIENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(clientsKwargs))

    // *******************************************************************
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.client.id != '0000000000' && nextprops.client.id != this.props.client.id) {

      const id = nextprops.client.id
      const kwargs = {
        url: '/api/saleslist',
        clientId: id,
        successType: 'FETCH_CLIENT_SALES_WITH_DEBT_FULFILLED',
        errorType: 'FETCH_CLIENT_SALES_WITH_DEBT_REJECTED'
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(getClientPendingSales(kwargs))
    }

  }

  selectClient(event) {
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

    if (event.target.checked) {
      const item = {
        bill_id: sale.id,
        sale: sale,
        amount: Math.abs(parseFloat(sale.balance)),
        complete: true
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
        complete: false
      }
      this.props.dispatch({type: 'ADD_TO_PAYMENT_ARRAY', payload: item})

    } else {
      this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: sale.id})
    }
  }

  setPaySaleAmount(sale, event) {
    const target = event.target
    const value = parseFloat(target.value)
    this.props.dispatch({type: 'SET_AMOUNT_PAYMENT_ARRAY', payload: {amount: value, sale: sale}})
  }

  paymentTableItem(sale) {

    const movClass = sale.type == 'CREDIT' ? 'credit' : 'debit'
    const date = formatDate(sale.created)
    const balance = Math.abs(parseFloat(sale.balance)) ? Math.abs(parseFloat(sale.balance)) : 0
    if (balance > 0) {
      return <tr className={`${movClass}`} key={sale.id}>
        <td>{sale.consecutive}</td>
        <td>{date}</td>
        <td>₡ {sale.cart.cartTotal ? sale.cart.cartTotal.formatMoney(2, ',', '.') : 0}</td>
        <td>₡ {Math.abs(parseFloat(sale.balance)) ? Math.abs(parseFloat(sale.balance)).formatMoney(2, ',', '.') : 0}</td>
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
  }

  saveMovements() {
    // ITEMS USED BY PAYMENT OBJECT
    const array = [...this.props.paymentArray]
    // const user = JSON.stringify(this.props.user)
    // const client = JSON.stringify(this.props.client)
    const sales = JSON.stringify(this.props.paymentArray)
    const clientId = this.props.client.id

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
      amount: amount
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
    const clients = this.props.clients

    const clientsWithCredit = clients.length
      ? clients.filter(client => client.has_credit)
      : []

    const clientsSelect = clientsWithCredit.map(client => {
      return {text: `${client.code} - ${client.name} ${client.last_name}`, id: client.id}
    })

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

    return <div className='payment'>
      <h1>Registrar pago a Facturas:</h1>

      <div className='payment-header'>
        <div className='payment-header-select'>
          <Select2
            data={clientsSelect}
            onSelect={this.selectClient.bind(this)}
            value={this.props.client.id}
            className='form-control'
            onUnselect={this.unselectClient.bind(this)}
            options={{
              placeholder: 'Elija un cliente...',
              allowClear: true
            }}
          />
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
