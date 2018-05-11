import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem } from '../../../../../utils/api'

@connect((store) => {
  return {
    warehouse: store.warehouses.warehouseActive,
    warehouses: store.warehouses.warehouses,
    provinces: store.addresses.provinces,
    cantons: store.addresses.cantons,
    districts: store.addresses.districts,
    towns: store.addresses.towns
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_WAREHOUSE', payload: ''})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_WAREHOUSE', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'code',
        url: '/api/warehouses/',
        lookUpValue: lookUp,
        dispatchType: 'SET_WAREHOUSE',
        dispatchType2: 'SET_WAREHOUSE_OLD',
        dispatchErrorType: 'WAREHOUSE_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Clientes',
        redirectUrl: '/admin/warehouses',
        history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItem(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.warehouse.id == '0000000000') {

        const kwargs = {
          lookUpField: 'code',
          url: '/api/warehouses/',
          lookUpValue: lookUp,
          dispatchType: 'SET_WAREHOUSE',
          dispatchType2: 'SET_WAREHOUSE_OLD',
          dispatchErrorType: 'WAREHOUSE_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Clientes',
          redirectUrl: '/admin/warehouses',
          history: this.props.history
        }
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch(setItem(kwargs))

      }
    }
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
      case 'select-one':
      {
        this.clearAdrresses(target.name)
        value = target.value
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const warehouse = {
      ...this.props.warehouse
    }

    warehouse[name] = value

    this.props.dispatch({type: 'SET_WAREHOUSE', payload: warehouse})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  render() {

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Datos generales</span>
        <hr />

        <div className='form-group'>
          <label>Código</label>
          <input value={this.props.warehouse.code} name='code' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.warehouse.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Descripción</label>
          <input value={this.props.warehouse.description} name='description'
            onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Ubicación</label>
          <input value={this.props.warehouse.location} name='location'
            onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
