import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
// import alertify from 'alertifyjs'
import {getItemDispatch} from '../../../utils/api'
import {getClientPendingSales} from '../../../utils/getClientPendingSales.js'
import {formatDate} from '../../../utils/formatDate.js'

@connect((store) => {
  return {
    paymentArray: store.payments.paymentArray,
    clients: store.clients.clients,
    client: store.clients.clientActive,
    clientActiveSalesWithDebt: store.unpaidSales.clientActiveSalesWithDebt
  }
})
export default class Update extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT_SALES_WITH_DEBT', payload: ''})

    // Then fetch the elements of the model and dispatch to reducer
    // *******************************************************************
    const clientsKwargs = {
      url: '/api/clients',
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
        url: '/api/sales',
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
  }

  paySaleComplete(sale, event) {

    this.props.dispatch({type: 'REMOVE_FROM_PAYMENT_ARRAY', payload: sale.id})
    document.getElementById(`${sale.id}-checkbox-partial`).checked = false
    document.getElementById(`${sale.id}-input-partial`).value = ''

    if (event.target.checked) {
      const item = {
        sale: sale,
        amount: sale.debt,
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

  onConsultBtn() {

  }

  paymentTableItem(sale) {

    const movClass = sale.type == 'CREDIT' ? 'credit' : 'debit'
    const date = formatDate(sale.created)
    const debt = sale.debt ? sale.debt : 0
    if (debt > 0) {
      return <tr className={`${movClass}`} key={sale.id}>
        <td>{sale.bill_number}</td>
        <td>{date}</td>
        <td>₡ {sale.cart.cartTotal ? sale.cart.cartTotal.formatMoney(2, ',', '.') : 0}</td>
        <td>₡ {sale.debt ? sale.debt.formatMoney(2, ',', '.') : 0}</td>
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

    const clientDebt = this.props.client.debt
    let paymentTotal = 0
    const array = this.props.paymentArray

    console.log(array)

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
