/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { setItem } from '../../../../utils/api'
import {getSaleMovements} from '../../../../utils/getSaleMovements'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    movements: store.saleMovements.saleMovements,
    sale: store.saleMovements.saleActive,
    presale: store.saleMovements.presaleActive
  }
})

class MovementsList extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_SALE', payload: ''})
    this.props.dispatch({type: 'CLEAR_SALE_MOVEMENTS', payload: ''})

    const lookUp = this.props.location.pathname.split('/').pop()

    const firstChar = lookUp.charAt(0)
    const lookUpToGet = lookUp.substr(1)
    let kwargs = {}

    if (firstChar == 'v') {
      kwargs = {
        lookUpField: 'consecutive',
        url: '/api/saleslist/',
        lookUpValue: lookUpToGet,
        dispatchType: 'SET_SALE',
        dispatchType2: '',
        dispatchErrorType: 'SALE_NOT_FOUND',
        history: this.props.history,
        lookUpName: 'Número de consectivo',
        modelName: 'Ventas'
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItem(kwargs))
    }

    if (firstChar == 'a') {
      kwargs = {
        lookUpField: 'consecutive',
        url: '/api/presaleslist/',
        lookUpValue: lookUpToGet,
        dispatchType: 'SET_PRESALE',
        dispatchType2: '',
        dispatchErrorType: 'PRESALE_NOT_FOUND',
        history: this.props.history,
        lookUpName: 'Número de consectivo',
        modelName: 'Apartados'
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItem(kwargs))
    }

  }

  componentWillReceiveProps(nextprops) {

    if (nextprops.sale.id != '0000000000' && nextprops.sale.id != this.props.sale.id) {

      const id = nextprops.sale.id
      const kwargs = {
        url: '/api/creditmovementslist',
        saleId: id,
        successType: 'FETCH_SALE_MOVEMENTS_FULFILLED',
        errorType: 'FETCH_SALE_MOVEMENTS_REJECTED'
      }

      this.props.dispatch(getSaleMovements(kwargs))

    }

    if (nextprops.presale.id != '0000000000' && nextprops.presale.id != this.props.presale.id) {

      const id = nextprops.sale.id
      const kwargs = {
        url: '/api/creditmovementslist',
        saleId: id,
        successType: 'FETCH_SALE_MOVEMENTS_FULFILLED',
        errorType: 'FETCH_SALE_MOVEMENTS_REJECTED'
      }

      this.props.dispatch(getSaleMovements(kwargs))

    }

  }

  movementItem(movement) {
    const movClass = movement.movement_type == 'CRED' ? 'credit' : 'debit'
    const typeText = movement.movement_type == 'CRED' ? 'Crédito' : 'Débito'
    const date = new Date(movement.created)

    return <tr className={`${movClass}`} key={movement.id}>
      <td>{movement.consecutive}</td>
      <td>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</td>
      <td>{typeText}</td>
      <td>₡ {Math.abs(parseFloat(movement.amount)).formatMoney(2, ',', '.')}</td>
      <td>{movement.description}</td>
    </tr>
  }

  // Render the product
  render() {
    const movements = this.props.movements

    const sale = this.props.sale
    let debits = 0
    let credits = 0
    const balance = Math.abs(parseFloat(sale.balance)) || 0

    const rows = movements.length
      ? movements.map(movement => {
        if (movement.movement_type == 'CRED') {
          credits += Math.abs(parseFloat(movement.amount))
        }
        if (movement.movement_type == 'DEBI') {
          debits += Math.abs(parseFloat(movement.amount))
        }
        return this.movementItem(movement)
      })
      : <tr>
        <td>NO HAY MOVIMIENTOS</td>
      </tr>

    return <div className='list-container'>

      <h1>Movimientos de factura # {sale.consecutive}</h1>
      <div className='row movements'>
        <div className='col-xs-12 col-sm-8'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Movimiento #</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Monto</th>
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