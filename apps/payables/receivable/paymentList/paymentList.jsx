/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getClientCreditPayments} from '../../../../utils/getClientCreditPayments'
import { setItem } from '../../../../utils/api'
import {Link} from 'react-router-dom'
import {formatDate} from '../../../../utils/formatDate.js'

@connect((store) => {
  return {
    client: store.clients.clientActive,
    clientActiveCreditPayments: store.clientCreditPayments.clientActiveCreditPayments
  }
})
export default class PaymentList extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT_SALES_WITH_DEBT', payload: ''})

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

  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.client.id != '0000000000' && nextprops.client.id != this.props.client.id) {

      const id = nextprops.client.id
      // const code = nextprops.client.code
      const kwargs = {
        url: `/api/creditpaymentslist/?client_id=${id}`,
        clientId: id,
        successType: 'FETCH_CLIENT_CREDIT_PAYMENTS_FULFILLED',
        errorType: 'FETCH_CLIENT_CREDIT_PAYMENTS_REJECTED'
      }

      this.props.dispatch(getClientCreditPayments(kwargs))

    }

  }

  getPendingItem(item, client) {

    const date = formatDate(item.created)
    return <tr key={`${item.consecutive}_${item.type}`}>
      <td>{item.consecutive}</td>
      <td>{date}</td>
      <td>₡ {item.amount ? parseFloat(item.amount).formatMoney(2, ',', '.') : 0}</td>
      <td>{item.description}</td>
      <td><Link to={`/credits/payments/${item.consecutive}`}>Ver Pago</Link></td>
    </tr>

  }

  printList() {
    window.printDiv('print-payments-div', ['/static/fixedBundles/css/credits.css'])
  }

  // Render the product
  render() {

    const payments = this.props.clientActiveCreditPayments
    payments.sort((a, b) => {
      return new Date(a.created) - new Date(b.created)
    })
    const client = this.props.client

    const rows = payments.length
      ? payments.map(sale => {
        return this.getPendingItem(sale, client)
      })
      : <tr>
        <td>NO HAY PENDIENTES</td>
      </tr>

    return <div className='unpaidSales'>
      <div id='print-payments-div'>
        <h1>REPORTE DE PAGOS REALIZADOS POR CLIENTE</h1>

        <div className='unpaidSales-header'>
          <div className='unpaidSales-header-tittle'>
            <div>
              Cliente
            </div>
            {/* <div>
            Saldo Adeudado:
            </div> */}
          </div>
          <div className='unpaidSales-header-data'>
            <div>
              {`${this.props.client.code} - ${this.props.client.name} ${this.props.client.last_name}`}
            </div>
            {/* <div>
              ₡ {Math.abs(parseFloat(this.props.client.balance)).formatMoney(2, ',', '.')}
            </div> */}
          </div>
        </div>

        <div className='unpaidSales-body'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Pago #</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Ver Pago</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>

      <button onClick={this.printList.bind(this)} className='btn btn-primary print-payments-btn' >Imprimir</button>
    </div>

  }
}
