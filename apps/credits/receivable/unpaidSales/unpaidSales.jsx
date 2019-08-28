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
    clientActiveSalesWithDebt: store.unpaidSales.clientActiveSalesWithDebt
  }
})
export default class UnpaidSales extends React.Component {

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
      const code = nextprops.client.code
      const kwargs = {
        url: `/api/creditpaymentslist/get_client_bills/?code=${code}`,
        clientId: id,
        successType: 'FETCH_CLIENT_SALES_WITH_DEBT_FULFILLED',
        errorType: 'FETCH_CLIENT_SALES_WITH_DEBT_REJECTED'
      }

      this.props.dispatch(getClientPendingSales(kwargs))

    }

  }

  getPendingItem(item, client) {
    const saleObjectToUse = item.sale ? item.sale : item.presale ? item.presale : item
    const date = formatDate(saleObjectToUse.created)
    const typeText = item.sale ? 'FACTURA DE VENTA' : item.presale ? 'APARTADO' : 'MOVIMIENTO MANUAL'
    const typeChar = item.sale ? 'v' : item.presale ? 'a' : 'm'
    return <tr key={`${saleObjectToUse.consecutive}_${typeText}`}>
      <td>{saleObjectToUse.consecutive}</td>
      <td>{date}</td>
      <td>₡ {item.total ? parseFloat(item.total).formatMoney(2, ',', '.') : 0}</td>
      {/* <td>₡ {sale.debits ? sale.debits.formatMoney(2, ',', '.') : 0}</td> */}
      <td>₡ {item.balance ? parseFloat(item.balance).formatMoney(2, ',', '.') : 0}</td>
      <td>{typeText}</td>
      <td><Link to={`/credits/receivable/${client.code}/${typeChar}${saleObjectToUse.consecutive}`}>Ver Movimientos</Link></td>
    </tr>

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
        return this.getPendingItem(sale, client)
      })
      : <tr>
        <td>NO HAY PENDIENTES</td>
      </tr>

    return <div className='unpaidSales'>

      <h1>REPORTE DE TRANSACCIONES PENDIENTES DE PAGO</h1>

      <div className='unpaidSales-header'>
        <div className='unpaidSales-header-tittle'>
          <div>
            Cliente
          </div>
          <div>
          Saldo Total:
          </div>
        </div>
        <div className='unpaidSales-header-data'>
          <div>
            {`${this.props.client.code} - ${this.props.client.name} ${this.props.client.last_name}`}
          </div>
          <div>
            ₡ {Math.abs(parseFloat(this.props.client.balance)).formatMoney(2, ',', '.')}
          </div>
        </div>
      </div>

      <div className='unpaidSales-body'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Factura #</th>
              <th>Fecha</th>
              <th>Monto</th>
              {/* <th>Abonos</th> */}
              <th>Deuda</th>
              <th>Tipo</th>
              <th>Movimientos</th>
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
