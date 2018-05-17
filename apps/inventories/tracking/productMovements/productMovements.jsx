/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { setItem } from '../../../../utils/api'
import {getInventoryMovements} from './actions'

@connect((store) => {
  return {
    movements: store.inventoryMovements.inventoryMovements,
    product: store.inventoryMovements.productActive,
    warehouses: store.warehouses.warehouses,
    departments: store.products.departments,
    subdepartments: store.products.subdepartments
  }
})

export default class MovementsList extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_PRODUCT', payload: ''})
    this.props.dispatch({type: 'CLEAR_INVENTORY_MOVEMENTS', payload: ''})

    const lookUp = this.props.location.pathname.split('/').pop()

    const kwargs = {
      lookUpField: 'code',
      url: '/api/products/',
      lookUpValue: lookUp,
      dispatchType: 'SET_PRODUCT',
      dispatchType2: 'SET_PRODUCT_OLD',
      dispatchErrorType: 'PRODUCT_NOT_FOUND',
      lookUpName: 'Código de producto',
      modelName: 'Productos',
      redirectUrl: '/inventories/tracking',
      history: this.props.history
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(setItem(kwargs))
  }

  componentWillReceiveProps(nextprops) {

    if (nextprops.product.id != '0000000000' && nextprops.product.id != this.props.product.id) {

      const id = nextprops.product.id
      const kwargs = {
        url: '/api/inventorymovements',
        filterField: 'product_id',
        ordering: '-created',
        productId: id,
        successType: 'FETCH_INVENTORY_MOVEMENTS_FULFILLED',
        errorType: 'FETCH_INVENTORY_MOVEMENTS_REJECTED'
      }

      this.props.dispatch(getInventoryMovements(kwargs))

    }

  }

  movementItem(movement) {
    const movClass = movement.movement_type == 'INPUT' ? 'input' : movement.movement_type == 'OUTPUT' ? 'output' : 'adjust'
    const typeText = movement.movement_type == 'INPUT' ? 'Entrada' : movement.movement_type == 'OUTPUT' ? 'Salida' : 'Toma Física'
    const date = new Date(movement.created)

    return <tr className={`${movClass}`} key={movement.id}>
      <td>{movement.consecutive}</td>
      <td>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</td>
      <td>{typeText}</td>
      <td>₡ {parseFloat(movement.amount).formatMoney(2, ',', '.')}</td>
      <td>{movement.description}</td>
    </tr>
  }

  // Render the product
  render() {
    const movements = this.props.movements

    const product = this.props.product

    const rows = movements.length
      ? movements.map(movement => {
        return this.movementItem(movement)
      })
      : <tr>
        <td>NO HAY MOVIMIENTOS</td>
      </tr>

    const department = this.props.departments.filter(department => {
      return department.id == product.department
    })

    const subdepartment = this.props.subdepartments.filter(subdepartment => {
      return subdepartment.id == product.subdepartment
    })

    const productDepartment = department.length ? `${department[0].code} - ${department[0].name}` : '-'
    const productSubDepartment = subdepartment.length ? `${subdepartment[0].code} - ${subdepartment[0].name}` : '-'

    const table1 = this.props.product
      ? <table className='table table-bordered'>
        <tbody>
          <tr>
            <th>Código:</th>
            <td>{product.code}</td>
          </tr>
          <tr>
            <th>Descripción:</th>
            <td>{product.description}</td>
          </tr>
          <tr>
            <th>Familia:</th>
            <td>{productDepartment}</td>
          </tr>
          <tr>
            <th>Sub-Familia:</th>
            <td>{productSubDepartment}</td>
          </tr>
          <tr>
            <th>Existencia:</th>
            <td>{`${product.inventory} ${product.unit}`}</td>
          </tr>
        </tbody>
      </table>
      : <div />

    const table2Content = this.props.warehouses.map(warehouse => {
      return product.inventory
        ? <tr key={warehouse.id}>
          <th>{warehouse.code} - {warehouse.name}</th>
          <td>{product['inventory_by_warehouse'][warehouse.id]} {product.unit}</td>
        </tr>
        : <tr key={warehouse.id}>
          <th>{warehouse.code} - {warehouse.name}</th>
          <td>-</td>
        </tr>
    })

    return <div className='list-container'>

      <h1>Movimientos de Inventario:</h1>
      <div className='row movements'>
        <div className='totals-sidebar col-xs-12 col-sm-4'>
          {table1}
          Existencia por Bodegas:
          <table className='table table-bordered'>
            <tbody>
              {table2Content}
            </tbody>
          </table>

        </div>
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

      </div>

    </div>
  }
}
