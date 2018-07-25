/*
 * Module dependencies
 */
import React from 'react'
import Select2 from 'react-select2-wrapper'
import {connect} from 'react-redux'
import {savePhysicalTake} from './actions.js'
import alertify from 'alertifyjs'
import { getPaginationItemDispatch } from '../../../../utils/api.js'

@connect((store) => {
  return {
    warehouses: store.warehouses.warehouses,
    warehouseActive: store.warehouses.warehouseActive,
    warehouseId: store.physicalTake.warehouse_id,
    description: store.physicalTake.description,
    type: store.physicalTake.type
  }
})
export default class Filters extends React.Component {

  setWarehouseActive(event) {
    const target = event.target
    const value = target.value
    this.props.dispatch({type: 'SET_WAREHOUSE', payload: value})
    this.props.dispatch({type: 'SET_PHYSICAL_TAKE_WH_ID', payload: value})
  }

  setDescription(event) {
    const target = event.target
    const value = target.value
    this.props.dispatch({type: 'SET_PHYSICAL_TAKE_DESCRIPTION', payload: value})
  }

  setType(event) {
    const target = event.target
    const value = target.value
    this.props.dispatch({type: 'SET_PHYSICAL_TAKE_TYPE', payload: value})
  }

  preSaveTake() {
    const _this = this
    alertify.confirm('ABRIR TOMA FÍSICA', 'Desea Abrir la toma físca para la bodega seleccionada?',
      function() { _this.saveTake() }, function() {}).set('labels', {ok: 'Abrir', cancel: 'Cancelar'})

  }

  saveTake() {
    const _this = this
    const isFull = this.props.type == 'COMPLETE'
    const kwargs = {
      warehouseId: this.props.warehouseId,
      isFull: isFull,
      description: this.props.description
    }
    const savePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      savePhysicalTake(kwargs, resolve, reject)
    })
    savePromise.then((data) => {
      alertify.alert('COMPLETADO', 'Toma física abierta correctamente')
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch({type: 'CLEAR_PHYSICAL_TAKES', payload: ''})
      _this.props.dispatch({type: `inventorySearch_CLEAR_SEARCH_RESULTS`, payload: ''})

      const takeKwargs = {
        url: `/api/physicaltakes/?limit=${this.props.pageSize}?ordering=-consecutive`,
        successType: 'FETCH_PHYSICAL_TAKES_FULFILLED',
        errorType: 'FETCH_PHYSICAL_TAKES_REJECTED'
      }

      _this.props.dispatch(getPaginationItemDispatch(takeKwargs))

    }).catch((err) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', err)
    })
  }

  // Main Layout
  render() {

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

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='physicalTake-create'>
      <div className='physicalTake-create-header'>
        Abrir nueva toma Física
      </div>
      <div className='physicalTake-create-container'>

        <h4>Bodega:</h4>
        <Select2
          name='department'
          value={this.props.warehouseActive}
          className='form-control'
          onSelect={this.setWarehouseActive.bind(this)}
          data={warehousesData}
          options={{
            placeholder: 'Elija una Bodega...',
            noResultsText: 'Sin elementos'
          }}
        />

        <h4>Tipo:</h4>
        <Select2
          name='department'
          value={this.props.type}
          className='form-control'
          onSelect={this.setType.bind(this)}
          data={[
            {text: 'Toma Completa', id: 'COMPLETE'},
            {text: 'Toma Parcial', id: 'PARTIAL'}
          ]}
          options={{
            placeholder: 'Elija un Tipo...',
            noResultsText: 'Sin elementos'
          }}
        />

        <h4>Descripción:</h4>
        <textarea rows='4' style={{resize: 'none'}}className='form-control' value={this.props.description} onChange={this.setDescription.bind(this)} />

        <button className='btn form-control' onClick={this.preSaveTake.bind(this)}> ABRIR </button>

      </div>

    </div>

  }

}
