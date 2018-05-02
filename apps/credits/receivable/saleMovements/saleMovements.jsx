/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { setItem } from '../../../../utils/api'
import {getSaleMovements} from '../../../../utils/getSaleMovements'

@connect((store) => {
  return {
    movements: store.saleMovements.saleMovements,
    sale: store.saleMovements.saleActive
  }
})

export default class MovementsList extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_SALE', payload: ''})
    this.props.dispatch({type: 'CLEAR_SALE_MOVEMENTS', payload: ''})

    const lookUp = this.props.location.pathname.split('/').pop()

    const kwargs = {
      lookUpField: 'bill_number',
      url: '/api/sales/',
      lookUpValue: lookUp,
      dispatchType: 'SET_SALE',
      dispatchType2: 'SET_SALE_OLD',
      dispatchErrorType: 'SALE_NOT_FOUND',
      lookUpName: 'Numéro de factura',
      modelName: 'Clientes',
      redirectUrl: '/credits/receivable',
      history: this.props.history
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(setItem(kwargs))
  }

  componentWillReceiveProps(nextprops) {

    if (nextprops.sale.id != '0000000000' && nextprops.sale.id != this.props.sale.id) {

      const id = nextprops.sale.id
      const kwargs = {
        url: '/api/creditmovements',
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
      <td>{movement.movement_number}</td>
      <td>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</td>
      <td>{typeText}</td>
      <td>₡ {parseFloat(movement.amount).formatMoney(2, ',', '.')}</td>
      <td>{movement.description}</td>
    </tr>
  }

  // Render the product
  render() {
    const movements = this.props.movements

    const sale = this.props.sale
    const debits = sale.debits || 0
    const credits = sale.credits || 0
    const debt = sale.debt || 0

    const rows = movements.length
      ? movements.map(movement => {
        return this.movementItem(movement)
      })
      : <tr>
        <td>NO HAY MOVIMIENTOS</td>
      </tr>

    return <div className='list-container'>

      <h1>Movimientos de factura # {sale.bill_number}</h1>
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
                  <th>Céditos</th>
                  <td>₡ {credits.formatMoney(2, ',', '.')}</td>
                </tr>
                <tr>
                  <th>Débitos</th>
                  <td>₡ {debits.formatMoney(2, ',', '.')}</td>
                </tr>
                <tr>
                  <th>Saldo:</th>
                  <td>₡ {debt.formatMoney(2, ',', '.')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  }
}
