/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getOpenTakes} from './actions.js'
import Select2 from 'react-select2-wrapper'

@connect((store) => {
  return {
    cart: store.checkTakeMovements.cart,
    takeId: store.checkTakeMovements.physicalTakeId,
    openTakes: store.checkTakeMovements.openTakes,
    productActive: store.checkTakeMovements.productActive,
    productMovements: store.checkTakeMovements.productMovements
  }
})
export default class Aside extends React.Component {

  componentWillMount() {
    this.props.dispatch(getOpenTakes())
  }

  setTakeId(event) {
    const target = event.target
    const value = target.value
    this.props.dispatch({type: 'SET_MOVEMENTS_TAKE_ID', payload: value})
  }

  getAlreadyAmount(movements) {
    let amount = 0
    for (let i = 0; i < movements.length; i++) {
      amount += parseFloat(movements[i].amount)
    }
    return amount
  }

  // Main Layout
  render() {

    const openTakesData = this.props.openTakes.map(take => {
      return {text: `${take.consecutive} - ${take.warehouse_name} - ${take.description}`, id: `${take.id}`}
    })

    const movements = this.props.productMovements
    const active = this.props.productActive
    let productCode = '0000'
    let productName = 'Sin Producto Seleccionado'
    let alreadyTaken = '0'

    if (active && movements[active]) {
      productCode = movements[active].product.code
      productName = movements[active].product.description
      alreadyTaken = this.getAlreadyAmount(movements[active].movements)
    }

    return <div className='take-movements-aside'>
      <h4>Seleccionar Toma Física:</h4>
      <Select2
        name='takeId'
        value={this.props.takeId}
        className='form-control'
        onSelect={this.setTakeId.bind(this)}
        data={openTakesData}
        options={{
          placeholder: 'Elija una toma Física...',
          noResultsText: 'Sin elementos'
        }}
      />

      <h4 className='consult'>Cantidad ya ingresada:</h4>

      <table className='table'>
        <tbody>
          <tr>
            <th>Código:</th>
            <td>{productCode}</td>
          </tr>
          <tr>
            <th>Descripción:</th>
            <td>{productName}</td>
          </tr>
          <tr>
            <th>Ya en Toma:</th>
            <td>{alreadyTaken}</td>
          </tr>
        </tbody>
      </table>
    </div>

  }

}
