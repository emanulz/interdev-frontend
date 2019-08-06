import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getItemDispatch } from '../../../../../utils/api.js'

@connect((store) => {
  return {
    product: store.productsAdmin.productActive,
    products: store.productsAdmin.products,
    warehouses: store.warehouses.warehouses
  }
})

class Inventories extends React.Component {

  componentWillMount() {

    const warehouseKwargs = {
      url: '/api/warehouses',
      successType: 'FETCH_WAREHOUSES_FULFILLED',
      errorType: 'FETCH_WAREHOUSES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(warehouseKwargs))

  }

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value
    // const value = target.type === 'checkbox' ? target.checked : target.value
    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : 0
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const product = {
      ...this.props.product
    }

    product[name] = value

    this.props.dispatch({type: 'SET_PRODUCT', payload: product})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  render() {
    const product = this.props.product
    const inventoryObject = product.inventory_existent
    let inventory = ''
    try {
      inventory = JSON.parse(inventoryObject)
    } catch (err) {
      console.log(err)
    }
    const table2Content = this.props.warehouses.map(warehouse => {
      return inventory
        ? <tr key={warehouse.id}>
          <th>{warehouse.code} - {warehouse.name}</th>
          <td>{inventory[warehouse.id] ? parseFloat(inventory[warehouse.id]).toFixed(2) : '-' }</td>
        </tr>
        : <tr key={warehouse.id}>
          <th>{warehouse.code} - {warehouse.name}</th>
          <td>-</td>
        </tr>
    })
    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Existencias por Bodega</span>
        <hr />

        <div className='form-group'>
          <table className='table table-bordered'>
            <tbody>
              {table2Content}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Inventories)
