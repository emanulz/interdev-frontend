/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
// import { saveItem, getNextNumericCode, fetchItems } from '../../admin/utils/api'
import { saveMovement } from './actions'
import alertify from 'alertifyjs'
import { getItemDispatch } from '../../../../utils/api.js'

@connect((store) => {
  return {
    movements: store.products.productmovements,
    productActive: store.products.productActive,
    visible: store.sidePanel.visible,
    movement: store.movements.inventoryMovementActive,
    departments: store.products.departments,
    subdepartments: store.products.subdepartments,
    warehouses: store.warehouses.warehouses,
    warehouseActive: store.warehouses.warehouseActive,
    warehouseInputActive: store.warehouses.warehouseInputActive,
    warehouseOutputActive: store.warehouses.warehouseOutputActive,
    user: store.user.user
  }
})
export default class Products extends React.Component {

  togglePanel() {
    this.props.dispatch({type: 'TOGGLE_PANEL', payload: ''})
    this.props.dispatch({type: 'CLEAR_INVENTORY_MOVEMENT', payload: ''})
  }

  handleInputChange(event) {

    const target = event.target
    let value

    switch (target.type) {
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : ''
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const movement = {
      ...this.props.movement
    }

    movement[name] = value

    this.props.dispatch({type: 'SET_INVENTORY_MOVEMENT', payload: movement})
  }

  saveBtn() {
    const movement = {...this.props.movement}
    if (movement.movement_type == 'OUTPUT-INPUT') {
      // VALIDATIONS FOR DOUBLE COMES HERE
      this.saveTransferMovement()
    } else {
      // VALIDATIONS FOR SINGLE COMES HERE
      this.saveSingleMovement()
    }
  }

  saveSingleMovement() {

    const movement = {...this.props.movement}
    // ITEMS USED BY MOVEMENT OBJECT AND SERIALIZE SOME OF THEM
    const user = JSON.stringify(this.props.user)
    movement.user = user

    const warehouse = this.props.warehouses.filter(warehouse => warehouse.id == movement.warehouse_id)
    movement.warehouse = JSON.stringify(warehouse[0]) || ''
    movement.product = JSON.stringify(movement.product)
    movement.mov_type = movement.movement_type

    delete movement['id']
    delete movement['fromWarehouse_id']
    delete movement['toWarehouse_id']
    delete movement['user']
    // KWARGS USED IN FUNCTION
    const kwargs = {
      url: `/api/products/${this.props.movement.product.id}/inventory_movement/`,
      item: movement,
      user: this.props.user
    }

    // MAKE "THIS" AVAILABLE FOR SUB-FUNCTIONS
    const _this = this

    const saveMovementPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveMovement(kwargs, resolve, reject))
      console.log('MOVIMIENTOOO', kwargs.item)
    })
    // SAVE MOVEMENT
    saveMovementPromise.then(data => {

      // THEN CLEAR THE MOVEMENT ACTIVE
      _this.props.dispatch({type: 'CLEAR_INVENTORY_MOVEMENT', payload: ''})

      // THEN REFECTH PRODUCTS
      const productKwargs = {
        url: '/api/productslist',
        successType: 'FETCH_PRODUCTS_FULFILLED',
        errorType: 'FETCH_PRODUCTS_REJECTED'
      }
      _this.props.dispatch(getItemDispatch(productKwargs))
      // ALERT OF COMPLETED
      alertify.alert('COMPLETADO', 'Movimiento de invetario guardado correctamente')
      // TOGGLE THE PANEL
      _this.props.dispatch({type: 'TOGGLE_PANEL', payload: ''})

    }).catch(err => {
      alertify.alert('ERROR', `Hubo un Error al guardar el movimiento, por favor intente de nuevo, ERROR: ${err}`)
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })

  }

  saveTransferMovement() {

    const movement = {...this.props.movement}
    // ITEMS USED BY MOVEMENT OBJECT AND SERIALIZE SOME OF THEM
    const user = JSON.stringify(this.props.user)
    movement.user = user

    const warehouse = this.props.warehouses.filter(warehouse => warehouse.id == movement.warehouse_id)
    movement.warehouse = JSON.stringify(warehouse[0]) || ''
    movement.product = JSON.stringify(movement.product)
    movement.mov_type = movement.movement_type
    movement.origin_warehouse_id = movement.fromWarehouse_id
    movement.destination_warehouse_id = movement.toWarehouse_id

    delete movement['id']
    delete movement['fromWarehouse_id']
    delete movement['toWarehouse_id']
    delete movement['user']

    console.log(movement)

    // KWARGS USED IN FUNCTION
    const kwargs = {
      url: `/api/products/${this.props.movement.product.id}/inventory_transfer/`,
      item: movement,
      user: this.props.user
    }

    // MAKE "THIS" AVAILABLE FOR SUB-FUNCTIONS
    const _this = this

    const saveMovementPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveMovement(kwargs, resolve, reject))
      console.log('MOVIMIENTOOO', kwargs.item)
    })
    // SAVE MOVEMENT
    saveMovementPromise.then(data => {

      // THEN CLEAR THE MOVEMENT ACTIVE
      _this.props.dispatch({type: 'CLEAR_INVENTORY_MOVEMENT', payload: ''})

      // THEN REFECTH PRODUCTS
      const productKwargs = {
        url: '/api/productslist',
        successType: 'FETCH_PRODUCTS_FULFILLED',
        errorType: 'FETCH_PRODUCTS_REJECTED'
      }
      _this.props.dispatch(getItemDispatch(productKwargs))
      // ALERT OF COMPLETED
      alertify.alert('COMPLETADO', 'Movimiento de invetario guardado correctamente')
      // TOGGLE THE PANEL
      _this.props.dispatch({type: 'TOGGLE_PANEL', payload: ''})

    }).catch(err => {
      alertify.alert('ERROR', `Hubo un Error al guardar el movimiento, por favor intente de nuevo, ERROR: ${err}`)
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })

  }

  saveDoubleMovement() {

    const movementOutput = {...this.props.movement}
    const movementInput = {...this.props.movement}
    // ITEMS USED BY MOVEMENT OBJECT AND SERIALIZE SOME OF THEM
    // USER
    const user = JSON.stringify(this.props.user)
    movementOutput.user = user
    movementInput.user = user
    // WAREHOUSE OBJECT AND WAREHOUSE_ID
    const warehouseOutput = this.props.warehouses.filter(warehouse => warehouse.id == movementOutput.fromWarehouse_id)
    const warehouseInput = this.props.warehouses.filter(warehouse => warehouse.id == movementInput.toWarehouse_id)

    movementOutput.warehouse = JSON.stringify(warehouseOutput[0]) || ''
    movementOutput.warehouse_id = movementOutput.fromWarehouse_id

    movementInput.warehouse = JSON.stringify(warehouseInput[0]) || ''
    movementInput.warehouse_id = movementOutput.toWarehouse_id

    // PRODUCT
    movementOutput.product = JSON.stringify(movementOutput.product)
    movementInput.product = JSON.stringify(movementInput.product)

    // MOVEMENT TYPE
    movementOutput.movement_type = 'OUTPUT'
    movementInput.movement_type = 'INPUT'

    // KWARGS FOR OUTPUT AND INPUT
    const kwargsOutput = {
      url: '/api/inventorymovements/',
      item: movementOutput,
      logCode: 'INVENTORY_MOVEMENT_CREATE',
      logDescription: 'Creación de nuevo movimiento de crédito',
      logModel: 'INVENTORY_MOVEMENT',
      user: this.props.user
    }

    const kwargsInput = {
      url: '/api/inventorymovements/',
      item: movementInput,
      logCode: 'INVENTORY_MOVEMENT_CREATE',
      logDescription: 'Creación de nuevo movimiento de crédito',
      logModel: 'INVENTORY_MOVEMENT',
      user: this.props.user
    }

    // MAKE "THIS" AVAILABLE FOR SUB-FUNCTIONS
    const _this = this
    // CREATE PROMISES FOR OUT AND IN
    const saveOutputMovementPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveMovement(kwargsOutput, resolve, reject))
    })

    const saveInputMovementPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveMovement(kwargsInput, resolve, reject))
    })
    // ADD THEM TO AN ARRAY
    const promises = [saveOutputMovementPromise, saveInputMovementPromise]

    // THEN SAVE MOVEMENTS WITH PROMISE ALL
    Promise.all(promises).then(() => {
      // THEN CLEAR THE MOVEMENT ACTIVE
      _this.props.dispatch({type: 'CLEAR_INVENTORY_MOVEMENT', payload: ''})

      // THEN REFECTH PRODUCTS
      const productKwargs = {
        url: '/api/products',
        successType: 'FETCH_PRODUCTS_FULFILLED',
        errorType: 'FETCH_PRODUCTS_REJECTED'
      }
      _this.props.dispatch(getItemDispatch(productKwargs))
      // ALERT OF COMPLETED
      alertify.alert('COMPLETADO', 'Movimientos de invetario guardados correctamente')
      // TOGGLE THE PANEL
      _this.props.dispatch({type: 'TOGGLE_PANEL', payload: ''})

    }).catch(err => {
      alertify.alert('ERROR', `Hubo un Error al guardar el movimiento, por favor intente de nuevo, ERROR: ${err}`)
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }
  // Main Layout
  render() {

    const panelClass = this.props.visible
      ? 'inventory-sidePanel visible'
      : 'inventory-sidePanel'

    const product = this.props.productActive

    try {
      const inventoryByWarehouse = JSON.parse(product.inventory_existent)
      product.inventory_existent = inventoryByWarehouse
    } catch(err){
      console.log(err)
    }

    const department = this.props.departments.filter(department => {
      return department.id == product.department
    })

    const subdepartment = this.props.subdepartments.filter(subdepartment => {
      return subdepartment.id == product.subdepartment
    })

    const productDepartment = department.length ? `${department[0].code} - ${department[0].name}` : '-'
    const productSubDepartment = subdepartment.length ? `${subdepartment[0].code} - ${subdepartment[0].name}` : '-'

    const table = this.props.productActive
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
            <td>{`${product.inventory_existent.total} ${product.unit}`}</td>
          </tr>
        </tbody>
      </table>
      : <div />

    const table2Content = this.props.warehouses.map(warehouse => {
      return product.inventory_existent
        ? <tr key={warehouse.id}>
          <th>{warehouse.code} - {warehouse.name}</th>
          <td>{product.inventory_existent[warehouse.id]} {product.unit}</td>
        </tr>
        : <tr key={warehouse.id}>
          <th>{warehouse.code} - {warehouse.name}</th>
          <td>-</td>
        </tr>
    })

    // ********************************************************************
    // SELECT2 DATA
    // ********************************************************************
    const warehouses = this.props.warehouses

    warehouses.sort((a, b) => {
      return a.code - b.code
    })

    const warehousesData = warehouses.map(warehouse => {
      return {text: `${warehouse.code} - ${warehouse.name}`, id: warehouse.id}
    })

    const movementTypeData = [
      {text: `1 - Entrada`, id: 'INPUT'},
      {text: `2 - Salida`, id: 'OUTPUT'},
      {text: `3 - Toma Física`, id: 'ADJUST'},
      {text: `4 - Traslado entre bodegas`, id: 'OUTPUT-INPUT'}
    ]

    // ********************************************************************
    // WAREHOUSE INPUT TO RENDER
    // ********************************************************************

    const warehouseInputToRender = this.props.movement.movement_type == 'OUTPUT-INPUT'
      ? <div>
        <Select2
          name='fromWarehouse_id'
          value={this.props.movement.fromWarehouse_id}
          onSelect={this.handleInputChange.bind(this)}
          className='form-control'
          data={warehousesData}
          options={{
            placeholder: 'Elija una Bodega de origen...',
            noResultsText: 'Sin elementos'
          }}
        />
        <Select2
          name='toWarehouse_id'
          value={this.props.movement.toWarehouse_id}
          onSelect={this.handleInputChange.bind(this)}
          className='form-control'
          data={warehousesData}
          options={{
            placeholder: 'Elija una Bodega de destino...',
            noResultsText: 'Sin elementos'
          }}
        />
      </div>
      : <Select2
        name='warehouse_id'
        value={this.props.movement.warehouse_id}
        onSelect={this.handleInputChange.bind(this)}
        className='form-control'
        data={warehousesData}
        options={{
          placeholder: 'Elija una Bodega...',
          noResultsText: 'Sin elementos'
        }}
      />

    return <div className={panelClass}>
      <div className='inventory-sidePanel-container'>
        <div className='inventory-sidePanel-container-header'>
          Registrar Movimiento
          <span onClick={this.togglePanel.bind(this)} className='fa fa-close' />
        </div>
        <div className='inventory-sidePanel-container-content'>
          <div className='inventory-sidePanel-container-content-product'>
            Datos del Producto:
            {table}
            Existencia por Bodegas:
            <table className='table table-bordered'>
              <tbody>
                {table2Content}
              </tbody>
            </table>
          </div>
          <div className='inventory-sidePanel-container-content-actions'>
            Movimiento de Producto
            <Select2
              name='movement_type'
              value={this.props.movement.movement_type}
              onSelect={this.handleInputChange.bind(this)}
              className='form-control'
              data={movementTypeData}
              options={{
                placeholder: 'Elija una Tipo de Movimiento...',
                noResultsText: 'Sin elementos'
              }}
            />

            {warehouseInputToRender}

            <input value={this.props.movement.amount} name='amount' type='number' placeholder='Cantidad'
              onChange={this.handleInputChange.bind(this)} className='form-control' />
            <input value={this.props.movement.description} name='description' type='text' placeholder='Descripción'
              onChange={this.handleInputChange.bind(this)} className='form-control' />
            <button onClick={this.saveBtn.bind(this)} className='btn btn-primary'>Registrar</button>
          </div>
        </div>
      </div>
    </div>

  }

}
