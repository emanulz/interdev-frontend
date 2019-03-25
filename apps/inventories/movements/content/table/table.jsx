/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {filterProducts} from './actions'

@connect((store) => {
  return {
    products: store.products.products,
    searchResults: store.inventorySearch.searchResults,
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
    const results = this.props.searchResults
    try {
      results.forEach(product => {
        const inventoryByWarehouse = JSON.parse(product.inventory_existent)
        product.inventory_existent = inventoryByWarehouse
      })
    } catch(err){
      console.log(err)
    }

    const tableData = results.length ? results : products
    const warehouses = this.props.warehouses

    // Just use products that use inventory
    const filteredData = tableData.filter((el) => el.inventory_enabled)
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

    // HEADER OF THE TABLE BASE OF WHETER IS PHYSICAL TAKE OR NOT
    const header = this.props.isPhysicalTake
      ? <tr>
        <td className='code-row'>Código</td>
        <td className='description-row'>Descripción</td>
        <td className='existence-row center'>Existencia</td>
        <td className='input-row center'>Cantidad</td>
        <td className='output-row center'>Registrar</td>
      </tr>
      : <tr>
        <td className='code-row'>Código</td>
        <td className='description-row'>Descripción</td>
        <td className='existence-row center'>{warehouseText}</td>
        <td className='existence-row center'>Precio Venta</td>
        <td className='input-row center'>Movimiento</td>
      </tr>

    // BODY OF THE TABLE BASE OF WHETER IS PHYSICAL TAKE OR NOT
    const body = filtered.map(product => {
      const movementBtn = <button onClick={this.bntMovementClick.bind(this, product)} className='btn btn-success'>
        <span className='fa fa-exchange' />
      </button>

      const inventory = this.props.warehouseActive
        ? product.inventory_existent[this.props.warehouseActive]
        : product.inventory_existent.total
      const productSellPrice = product.sell_price ? parseFloat(product.sell_price) : 0
      return <tr key={product.id}>
        <td>{product.code}</td>
        <td>{product.description}</td>
        <td className='center'>{inventory}</td>
        <td className='center'>₡ {productSellPrice.formatMoney(2, ',', '.')}</td>
        <td className='center'>{movementBtn}</td>
      </tr>
    })

    // RETURN BLOCK
    return <table className='inventories-products-table table'>
      <thead>
        {header}
      </thead>
      <tbody>
        {body}
      </tbody>
    </table>
  }

}
