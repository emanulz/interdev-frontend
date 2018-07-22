/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
import {savePhysicalTakeMovements, getOpenTakes} from './actions.js'
import Select2 from 'react-select2-wrapper'

@connect((store) => {
  return {
    cart: store.takeMovements.cart,
    takeId: store.takeMovements.physicalTakeId,
    openTakes: store.takeMovements.openTakes,
    productActive: store.takeMovements.productActive,
    productMovements: store.takeMovements.productMovements
  }
})
export default class Aside extends React.Component {

  componentWillMount() {
    this.props.dispatch(getOpenTakes())
  }

  downloadReport() {
    const url = `/reportsExcel/physicaltake/?physicaltakeid=${this.props.takeId}&isphysicaltake_full=True&includemonetaryvalue=True`
    window.open(url, '_blank')
  }

  setTakeId(event) {
    const target = event.target
    const value = target.value
    this.props.dispatch({type: 'SET_MOVEMENTS_TAKE_ID', payload: value})
  }

  preSaveTakeMovements() {
    if (!this.props.cart.length) {
      alertify.alert('ERROR', 'Por agregue movimientos para guardar.')
      return true
    }
    if (!this.props.takeId) {
      alertify.alert('ERROR', 'Por favor seleccione una toma física activa.')
      return true
    }
    const _this = this
    alertify.confirm('REGISTRAR MOVIMIENTOS', 'Registar los movimientos en la toma física sleccionada? Esta acción no se puede deshacer.',
      function() { _this.saveTakemovements() }, function() {}).set('labels', {ok: 'Registar', cancel: 'Cancelar'})
  }

  saveTakemovements() {
    const _this = this
    const kwargs = {
      cart: this.props.cart,
      takeId: this.props.takeId
    }
    const savePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      savePhysicalTakeMovements(kwargs, resolve, reject)
    })

    savePromise.then((data) => {
      alertify.alert('COMPLETADO', 'Movimientos agregados correctamente')
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      // CLEAR CART AND OTHER STUFF
      _this.props.dispatch({type: 'CLEAR_TAKE_MOVEMENTS_CART', payload: ''})
      _this.props.dispatch({type: 'CLEAR_TAKE_PRODUCT_MOVEMENTS', payload: ''})
      _this.props.dispatch({type: 'CLEAR_TAKE_PRODUCT_ACTIVE', payload: ''})

    }).catch((err) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', err)
    })
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
      <button className='btn btn-primary' onClick={this.preSaveTakeMovements.bind(this)}>
        Registrar Movimientos
      </button>

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

      <button className='btn btn-primary' onClick={this.downloadReport.bind(this)}>
        Descargar Listado de comparación
      </button>

    </div>

  }

}
