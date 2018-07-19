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
    openTakes: store.takeMovements.openTakes
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

    }).catch((err) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', err)
    })
  }

  // Main Layout
  render() {

    const openTakesData = this.props.openTakes.map(take => {
      return {text: `${take.consecutive} - ${take.warehouse_name} - ${take.description}`, id: `${take.id}`}
    })

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
    </div>

  }

}
