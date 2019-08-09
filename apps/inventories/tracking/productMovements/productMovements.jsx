/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { setItem } from '../../../../utils/api'
import {getInventoryMovements} from './actions'
import Select2 from 'react-select2-wrapper'
// import Pagination from '../../../../general/pagination/pagination.jsx'
// import ResultsPerPage from '../../../../general/pagination/resultsPerPage.jsx'

@connect((store) => {
  return {
    movements: store.inventoryMovements.inventoryMovements,
    product: store.inventoryMovements.productActive,
    warehouses: store.warehouses.warehouses,
    warehouseActive: store.warehouses.warehouseActive,
    departments: store.products.departments,
    subdepartments: store.products.subdepartments,
    warehouse_id: store.userProfile.salesWarehouse
  }
})

export default class MovementsList extends React.Component {

  componentWillUpdate(nextProps) {
    if (nextProps.warehouse_id != this.props.warehouse_id && nextProps.warehouse_id) {
      this.props.dispatch({type: 'SET_WAREHOUSE', payload: nextProps.warehouse_id})
    }
  }

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_PRODUCT', payload: ''})
    this.props.dispatch({type: 'CLEAR_INVENTORY_MOVEMENTS', payload: ''})

    const lookUp = this.props.location.pathname.split('/').pop()

    const kwargs = {
      lookUpField: 'code',
      url: '/api/productslist',
      lookUpValue: lookUp,
      dispatchType: 'SET_PRODUCT_TRACKING',
      dispatchType2: 'SET_PRODUCT_TRACKING_OLD',
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
        url: '/api/inventorymovementslistcustom',
        ordering: '-created',
        filterField: 'product_id',
        filter: id,
        filterField2: false,
        filter2: false,
        successType: 'FETCH_INVENTORY_MOVEMENTS_FULFILLED',
        errorType: 'FETCH_INVENTORY_MOVEMENTS_REJECTED'
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(getInventoryMovements(kwargs))

    }

  }

  setWarehouseActive(event) {
    const target = event.target
    const value = target.value

    this.props.dispatch({type: 'SET_WAREHOUSE', payload: value})

    const id = this.props.product.id
    const kwargs = {
      url: '/api/inventorymovementslistcustom',
      ordering: '-created',
      filterField: 'product_id',
      filter: id,
      filterField2: 'warehouse_id',
      filter2: value,
      successType: 'FETCH_INVENTORY_MOVEMENTS_FULFILLED',
      errorType: 'FETCH_INVENTORY_MOVEMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getInventoryMovements(kwargs))

  }

  unselectWarehouseActive() {
    this.props.dispatch({type: 'CLEAR_WAREHOUSES', payload: ''})

    const id = this.props.product.id
    const kwargs = {
      url: '/api/inventorymovementslistcustom',
      ordering: '-created',
      filterField: 'product_id',
      filter: id,
      filterField2: false,
      filter2: false,
      successType: 'FETCH_INVENTORY_MOVEMENTS_FULFILLED',
      errorType: 'FETCH_INVENTORY_MOVEMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getInventoryMovements(kwargs))

  }

  movementItem(movement) {
    const movClass = movement.movement_type == 'INPUT' ? 'movements-table-content center input'
      : movement.movement_type == 'OUTPUT' ? 'movements-table-content center output'
        : 'movements-table-content center adjust'
    const typeText = movement.movement_type == 'INPUT' ? 'Entrada' : movement.movement_type == 'OUTPUT' ? 'Salida' : 'T. Física'
    const date = new Date(movement.created)
    let afterAmount = 0
    try {
      const product2 = JSON.parse(movement.product)
      afterAmount = JSON.parse(product2.inventory_existent)[movement.warehouse_id]
    } catch (err) {}

    return <tr key={movement.id}>
      <td className='center'><div className='movements-table-content'>{movement.consecutive}</div></td>
      <td><div className='movements-table-content'>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</div></td>
      <td><div className={`${movClass}`} >{typeText}</div></td>
      <td><div className='movements-table-content'>{parseFloat(afterAmount) - parseFloat(movement.amount)}</div></td>
      <td><div className='movements-table-content'>{movement.amount}</div></td>
      <td><div className='movements-table-content'>{afterAmount}</div></td>
      <td><div className='movements-table-content'>{movement.warehouse.name}</div></td>
      <td><div className='movements-table-content'>{movement.description}</div></td>
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
            <td>{`${product.inventory_existent.total}`}</td>
          </tr>
          <tr>
            <th>Unidad:</th>
            <td>{`${product.unit}`}</td>
          </tr>
        </tbody>
      </table>
      : <div />

    const table2Content = this.props.warehouses.map(warehouse => {
      return product.inventory_existent[warehouse.id]
        ? <tr key={warehouse.id}>
          <th>{warehouse.code} - {warehouse.name}</th>
          <td>{product.inventory_existent[warehouse.id]}</td>
        </tr>
        : <tr key={warehouse.id}>
          <th>{warehouse.code} - {warehouse.name}</th>
          <td>0</td>
        </tr>
    })

    const warehouses = this.props.warehouses
    warehouses.sort((a, b) => {
      return a.code - b.code
    })
    const warehousesData = warehouses.map(warehouse => {
      return {text: `${warehouse.code} - ${warehouse.name}`, id: warehouse.id}
    })

    return <div className='list-container'>

      <h1>Movimientos de Inventario:</h1>
      <div className='row movements'>
        <div className='totals-sidebar col-xs-12 col-sm-4'>
          {table1}
          <h2>Filtro por bodega:</h2>
          <Select2
            name='department'
            value={this.props.warehouseActive}
            className='form-control'
            onSelect={this.setWarehouseActive.bind(this)}
            onUnselect={this.unselectWarehouseActive.bind(this)}
            data={warehousesData}
            options={{
              placeholder: 'Elija una Bodega...',
              noResultsText: 'Sin elementos',
              allowClear: true
            }}
          />
          <h2>Existencia por Bodegas:</h2>
          <table className='table table-bordered'>
            <tbody>
              {table2Content}
            </tbody>
          </table>

        </div>
        <div className='col-xs-12 col-sm-8'>
          {/* <div className='admin-list-results-pagination' >
            <ResultsPerPage url='/api/inventorymovementslist/' successType='FETCH_INVENTORY_MOVEMENTS_FULFILLED' errorType='FETCH_INVENTORY_MOVEMENTS_REJECTED' />
            <Pagination url='/api/inventorymovementslist/' successType='FETCH_INVENTORY_MOVEMENTS_FULFILLED' errorType='FETCH_INVENTORY_MOVEMENTS_REJECTED' />
          </div> */}
          <table className='table movements-table table-bordered'>
            <thead>
              <tr>
                <th className='center'>Movimiento #</th>
                <th className='center'>Fecha</th>
                <th className='center'>Tipo</th>
                <th className='center'>Anterior</th>
                <th className='center'>Monto/variación</th>
                <th className='center'>Final</th>
                <th className='center'>Bodega</th>
                <th className='center'>Detalle</th>
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
