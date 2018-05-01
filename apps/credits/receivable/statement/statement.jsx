/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getClientPendingSales} from '../../../../utils/getClientPendingSales'
import { setItem } from '../../../../utils/api'
import {Link} from 'react-router-dom'
import {formatDate} from '../../../../utils/formatDate.js'

@connect((store) => {
  return {
    client: store.clients.clientActive,
    clientActiveSalesWithDebt: store.statement.clientActiveSalesWithDebt
  }
})
export default class Statement extends React.Component {

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
      const kwargs = {
        url: '/api/sales',
        clientId: id,
        successType: 'FETCH_CLIENT_SALES_WITH_DEBT_FULFILLED',
        errorType: 'FETCH_CLIENT_SALES_WITH_DEBT_REJECTED'
      }

      this.props.dispatch(getClientPendingSales(kwargs))

    }

  }

  statementItem(sale, client) {

    const movClass = sale.type == 'CRED' ? 'credit' : 'debit'
    // const date = moment(sale.created).format('DD/MM/YYYY')
    const date = formatDate(sale.created)
    const debt = sale.debt ? sale.debt : 0
    if (debt > 0) {
      return <tr className={`${movClass}`} key={sale.id}>
        <td>{sale.bill_number}</td>
        <td>{date}</td>
        <td>₡ {sale.cart.cartTotal ? sale.cart.cartTotal.formatMoney(2, ',', '.') : 0}</td>
        <td>₡ {sale.debits ? sale.debits.formatMoney(2, ',', '.') : 0}</td>
        <td>₡ {sale.debt ? sale.debt.formatMoney(2, ',', '.') : 0}</td>
        <td><Link to={`/admin/receivable/statement/${client.code}/billmovements/${sale.id}`}>Ver</Link></td>
      </tr>
    }
  }

  // Render the product
  render() {

    const sales = this.props.clientActiveSalesWithDebt
    sales.sort((a, b) => {
      return new Date(a.created) - new Date(b.created)
    })
    const client = this.props.client

    const rows = sales.length
      ? sales.map(sale => {
        return this.statementItem(sale, client)
      })
      : <tr>
        <td>NO HAY MOVIMIENTOS</td>
      </tr>

    return <div className='list-container'>

      <h1>Estado de Cuenta</h1>

      <div className='row movements'>

        <div className='totals-sidebar col-xs-12 col-sm-10'>
          <table className='table table-bordered'>
            <tbody>
              <tr>
                <th>Cliente</th>
                <td>{`${this.props.client.code} - ${this.props.client.name} ${this.props.client.last_name}`}</td>
              </tr>
              <tr>
                <th>Saldo Total:</th>
                <td>₡ {this.props.client.debt.formatMoney(2, ',', '.')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='col-xs-12 col-sm-10'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Factura #</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Abonos</th>
                <th>Deuda</th>
                <th>Movimientos</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  }
}
