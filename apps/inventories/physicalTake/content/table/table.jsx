/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {filterProducts} from './actions'

@connect((store) => {
  return {
    products: store.products.products,
    warehouses: store.warehouses.warehouses,
    warehouseActive: store.warehouses.warehouseActive,
    departmentActive: store.products.departmentActive,
    subdepartmentActive: store.products.subdepartmentActive,
    filterText: store.products.filterText,
    productActive: store.products.productActive,
    movement: store.movements.productmovementActive,
    isPhysicalTake: store.products.isPhysicalTake
  }
})
export default class Table extends React.Component {

  bntMovementClick(product, event) {
    // CLEAR THE MOVEMENT IF ANY
    this.props.dispatch({type: 'CLEAR_INVENTORY_MOVEMENT', payload: ''})

    // SETS THE PRODUCT AND ID TO THE INVENTORY MOVEMENT
    this.props.dispatch({type: 'SET_PRODUCT', payload: product})

    // THEN TOGGLES PANEL
    this.props.dispatch({type: 'TOGGLE_PANEL', payload: ''})

  }

  // Main Layout
  render() {

    const products = this.props.products
    const warehouses = this.props.warehouses

    // Just use products that use inventory
    const filteredData = products.filter((el) => el.inventory_enabled)
    // Then Sort by code
    const sortedData = filteredData.sort((a, b) => a.code - b.code)
    // Get the data of the warehouse selected if any
    const warehouseSelected = warehouses.find(element => element.id == this.props.warehouseActive)
    // filter by elements on left column
    const filtered = filterProducts(
      sortedData, this.props.filterText,
      this.props.departmentActive,
      this.props.subdepartmentActive
    )

    const warehouseText = warehouseSelected ? `${warehouseSelected.name}` : 'Existencia Total'

    // HEADER OF THE TABLE
    const header = <tr>
      <td className='code-row'>Código</td>
      <td className='description-row'>Descripción</td>
      <td className='existence-row center'>{warehouseText}</td>
      <td className='input-row center'>Toma Física</td>
      <td className='btn-row center'>Registrar</td>
    </tr>

    // BODY OF THE TABLE BASE
    const body = filtered.map(product => {
      const movementBtn = <button onClick={this.bntMovementClick.bind(this, product)} className='btn btn-success'>
        <span className='fa fa-plus' />
      </button>

      const movementInput = <input
        className='form-control'
        type='number'
      />

      const inventory = this.props.warehouseActive
        ? product.inventory_by_warehouse[this.props.warehouseActive]
        : product.inventory

      return <tr key={product.id}>
        <td>{product.code}</td>
        <td>{product.description}</td>
        <td className='center'>{inventory}</td>
        <td className='center cell-input'>{movementInput}</td>
        <td className='center'>{movementBtn}</td>
      </tr>
    })

    // RETURN BLOCK
    return <table className='physicalTake-table table'>
      <thead>
        {header}
      </thead>
      <tbody>
        {body}
      </tbody>
    </table>
  }

}
