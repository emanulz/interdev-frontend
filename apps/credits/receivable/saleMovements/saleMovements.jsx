/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { setItemById } from '../../../../utils/api'
// import {getSaleMovements} from '../../../../utils/getSaleMovements'
import { withRouter } from 'react-router-dom'

import { loadClientToShow } from '../../clientCard/actions.js'

@connect((store) => {
  return {
    client: store.clients.clientActive,
    saleRecord: store.saleMovements.saleRecord
  }
})

class MovementsList extends React.Component {

  // componentWillMount() {
  //   this.props.dispatch({type: 'CLEAR_SALE', payload: ''})
  //   this.props.dispatch({type: 'CLEAR_SALE_MOVEMENTS', payload: ''})

  //   const lookUp = this.props.location.pathname.split('/').pop()

  //   const firstChar = lookUp.charAt(0)
  //   const lookUpToGet = lookUp.substr(1)
  //   let kwargs = {}

  //   if (firstChar == 'v') {
  //     kwargs = {
  //       lookUpField: 'consecutive',
  //       url: '/api/saleslist/',
  //       lookUpValue: lookUpToGet,
  //       dispatchType: 'SET_SALE',
  //       dispatchType2: '',
  //       dispatchErrorType: 'SALE_NOT_FOUND',
  //       history: this.props.history,
  //       lookUpName: 'Número de consectivo',
  //       modelName: 'Ventas'
  //     }
  //     this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
  //     this.props.dispatch(setItem(kwargs))
  //   }

  //   if (firstChar == 'a') {
  //     kwargs = {
  //       lookUpField: 'consecutive',
  //       url: '/api/presales/',
  //       lookUpValue: lookUpToGet,
  //       dispatchType: 'SET_PRESALE',
  //       dispatchType2: '',
  //       dispatchErrorType: 'PRESALE_NOT_FOUND',
  //       history: this.props.history,
  //       lookUpName: 'Número de consectivo',
  //       modelName: 'Apartados'
  //     }
  //     this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
  //     this.props.dispatch(setItem(kwargs))
  //   }

  // }

  componentDidMount() {
    this.props.dispatch({type: 'CLEAR_SALE_RECORD', payload: ''})
    const lookUp = this.props.location.pathname.split('/').pop()
    const kwargs = {
      url: '/api/creditsalerecord',
      lookUpValue: lookUp,
      dispatchType: 'SET_SALE_RECORD',
      dispatchType2: '',
      dispatchErrorType: 'CLEAR_SALE_RECORD',
      history: this.props.history,
      redirectUrl: this.props.location.pathname,
      lookUpName: 'Número de id',
      modelName: 'Records de Crédito'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(setItemById(kwargs))
  }

  // componentWillReceiveProps(nextprops) {

  //   if (nextprops.sale.id != '0000000000' && nextprops.sale.id != this.props.sale.id) {

  //     const id = nextprops.sale.id
  //     const kwargs = {
  //       url: '/api/creditmovementslist',
  //       saleId: id,
  //       successType: 'FETCH_SALE_MOVEMENTS_FULFILLED',
  //       errorType: 'FETCH_SALE_MOVEMENTS_REJECTED'
  //     }

  //     this.props.dispatch(getSaleMovements(kwargs))

  //   }

  //   if (nextprops.presale.id != '0000000000' && nextprops.presale.id != this.props.presale.id) {

  //     const id = nextprops.presale.id
  //     const kwargs = {
  //       url: '/api/creditmovementslist',
  //       saleId: id,
  //       successType: 'FETCH_SALE_MOVEMENTS_FULFILLED',
  //       errorType: 'FETCH_SALE_MOVEMENTS_REJECTED'
  //     }

  //     this.props.dispatch(getSaleMovements(kwargs))

  //   }

  // }

  movementItem(movement) {
    const movClass = movement.movement_type == 'CRED' ? 'credit' : 'debit'
    const typeText = movement.movement_type == 'CRED' ? 'Crédito' : 'Débito'
    const date = new Date(movement.created)
    const statusText = movement.is_null ? 'ANULADO' : 'APLICADO'
    return <tr className={`${movClass}`} key={movement.id}>
      <td>{movement.consecutive}</td>
      <td>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</td>
      <td>{typeText}</td>
      <td>₡ {Math.abs(parseFloat(movement.amount)).formatMoney(2, ',', '.')}</td>
      <td>{statusText}</td>
      <td>{movement.description}</td>
    </tr>
  }

  showClientInfo() {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(loadClientToShow(this.props.saleRecord.client.code))
  }

  // Render the product
  render() {

    const record = this.props.saleRecord
    const saleObjectToUse = record.sale ? record.sale : record.presale ? record.presale : record
    const typeText = record.sale ? 'factura' : record.presale ? 'apartado' : 'MOVIMIENTO MANUAL'
    let debits = 0
    let credits = 0
    const balance = record.balance ? Math.abs(parseFloat(record.balance)) : 0
    const movements = record.credit_movements ? record.credit_movements : []

    const rows = movements.length
      ? movements.map(movement => {
        if (movement.movement_type == 'CRED' && !movement.is_null) {
          credits += Math.abs(parseFloat(movement.amount))
        }
        if (movement.movement_type == 'DEBI' && !movement.is_null) {
          debits += Math.abs(parseFloat(movement.amount))
        }
        return this.movementItem(movement)
      })
      : <tr>
        <td>NO HAY MOVIMIENTOS</td>
      </tr>

    return <div className='list-container'>

      <h1>Movimientos de {typeText} # {saleObjectToUse.consecutive}</h1>

      <div className='unpaidSales-header'>
        <div className='unpaidSales-header-tittle'>
          <div>
            Cliente
          </div>
          <div>
            Saldo Total:
          </div>
          <div>
            Datos Cliente:
          </div>
        </div>
        <div className='unpaidSales-header-data'>
          <div>
            {`${this.props.client.code} - ${this.props.client.name} ${this.props.client.last_name}`}
          </div>
          <div>
            ₡ {Math.abs(parseFloat(this.props.client.balance)).formatMoney(2, ',', '.')}
          </div>
          <div>
            <button onClick={this.showClientInfo.bind(this)}>Consultar</button>
          </div>
        </div>
      </div>

      <div className='row movements'>
        <div className='col-xs-12 col-sm-8'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Movimiento #</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
        <div className='totals-sidebar col-xs-12 col-sm-4'>
          <div className='col-xs-12'>
            <table className='table table-bordered'>
              <tbody>
                <tr>
                  <th>Créditos</th>
                  <td>₡ {credits.formatMoney(2, ',', '.')}</td>
                </tr>
                <tr>
                  <th>Débitos</th>
                  <td>₡ {debits.formatMoney(2, ',', '.')}</td>
                </tr>
                <tr>
                  <th>Saldo:</th>
                  <td>₡ {balance.formatMoney(2, ',', '.')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(MovementsList)