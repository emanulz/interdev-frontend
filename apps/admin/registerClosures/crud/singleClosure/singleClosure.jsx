/*
 * Module dependencies
 */
import React from 'react'

import Unauthorized from '../../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import { getItemByIDDispatch } from '../../../../../utils/api.js'
import {loadRegisterClosureToPrint} from '../../../../../general/printRegisterClosure/actions.js'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    permissions: store.registerclosures.permissions,
    registerClosure: store.registerclosures.registerClosureActive
  }
})
class SingleClosure extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_REGISTER_CLOSURE_ACTIVE', payload: ''})
    const lookUp = this.props.location.pathname.split('/').pop()

    const kwargs = {
      url: `/api/registerclosure/${lookUp}`,
      successType: 'FETCH_REGISTER_CLOSURE_FULFILLED',
      errorType: 'FETCH_REGISTER_CLOSURE_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemByIDDispatch(kwargs))
  }

  getClosureCRCTable() {
    const closure = this.props.registerClosure

    return <table className='table closureTableCRC'>
      <thead>
        <tr>
          <th />
          <th>Sistema</th>
          <th>Cajero</th>
          <th>Diferencia</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Transferencias</th>
          <td>‎₡{parseFloat(closure.closure_money_crc_system_transfer).formatMoney()}</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <th>Tarjetas</th>
          <td>₡{parseFloat(closure.closure_money_crc_system_card).formatMoney()}</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <th>Efectivo</th>
          <td>₡{parseFloat(closure.closure_money_crc_system_cash).formatMoney()}</td>
          <td>₡{parseFloat(closure.closure_money_crc_cashier).formatMoney()}</td>
          <td>₡{parseFloat(closure.close_balance_crc).formatMoney()}</td>
        </tr>
      </tbody>
    </table>
  }

  getClosureUSDTable() {
    const closure = this.props.registerClosure

    return <table className='table closureTableUSD'>
      <thead>
        <tr>
          <th />
          <th>Sistema</th>
          <th>Cajero</th>
          <th>Diferencia</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Transferencias</th>
          <td>‎${parseFloat(closure.closure_money_usd_system_transfer).formatMoney()}</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <th>Tarjetas</th>
          <td>${parseFloat(closure.closure_money_usd_system_card).formatMoney()}</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <th>Efectivo</th>
          <td>${parseFloat(closure.closure_money_usd_system_cash).formatMoney()}</td>
          <td>${parseFloat(closure.closure_money_usd_cashier).formatMoney()}</td>
          <td>${parseFloat(closure.close_balance_usd).formatMoney()}</td>
        </tr>
      </tbody>
    </table>
  }

  reprintClosure() {
    if (this.props.registerClosure.id) {
      this.props.dispatch(loadRegisterClosureToPrint(this.props.registerClosure.id))
    }
  }

  goToMovements() {
    if (this.props.registerClosure.id) {
      const url = `/admin/registerclosures/${this.props.registerClosure.id}/movements`
      this.props.history.push(url)
    }
  }

  // Main Layout
  render() {

    let content = ''

    const code = this.props.registerClosure ? this.props.registerClosure.id : ''
    const cashierName = this.props.registerClosure ? this.props.registerClosure.cashier_name : ''

    switch (this.props.permissions.change) {
      case true:
      {
        content = <div className='heigh100 registerClosure'>
          <div className='registerClosure-container'>
            <div className='registerClosure-container-crc'>
              <h1>CIERRE EN COLONES:</h1>
              {this.getClosureCRCTable()}
            </div>
            <div className='registerClosure-container-usd'>
              <h1>CIERRE EN DOLARES:</h1>
              {this.getClosureUSDTable()}
            </div>
          </div>
          <div className='registerClosure-container'>
            <div className='registerClosure-container-totals'>
              <h1>TOTALES:</h1>

            </div>
            <div className='registerClosure-container-actions'>
              <h1>ACCIONES:</h1>

              <button onClick={this.reprintClosure.bind(this)} className='btn btn-primary'>REIMPRIMIR CIERRE</button>
              <button onClick={this.goToMovements.bind(this)} className='btn btn-success'>MOSTRAR MOVIMIENTOS</button>

            </div>
          </div>
        </div>
        break
      } // case

      case false:
      {
        content = <Unauthorized />
        break
      } // case
      default:
      {
        content = <div>FETCHING</div>
        break
      } // case
    }

    return <div className='create heigh100'>
      <div className='create-edit-header'>
        <h1>CIERRE DE CAJA# {code}</h1>
      </div>

      <div className='create-edit-header'>
        <h1>CAJERO: {cashierName}</h1>
      </div>

      {content}

    </div>

  }

}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(SingleClosure)