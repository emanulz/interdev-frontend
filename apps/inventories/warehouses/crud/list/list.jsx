/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import DataTable from '../../../../../general/dataTable/dataTable.jsx'
import { getItemDispatch } from '../../../../../utils/api.js'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    warehouses: store.warehouses.warehouses
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_WAREHOUSE', payload: ''})

    const warehouseKwargs = {
      url: '/api/warehouses',
      successType: 'FETCH_WAREHOUSES_FULFILLED',
      errorType: 'FETCH_WAREHOUSES_REJECTED'
    }

    this.props.dispatch(getItemDispatch(warehouseKwargs))

  }

  render() {

    const headerOrder = [
      {
        field: 'code',
        text: 'Código',
        type: 'primary'
      }, {
        field: 'name',
        text: 'Nombre'
      }, {
        field: 'description',
        text: 'Descripción'
      }
    ]

    const fetching = <div />
    const list = <DataTable headerOrder={headerOrder} model='warehouses' data={this.props.warehouses}
      addLink='/inventories/warehouses/add' idField='id' app='inventories' />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <h1>Listado de Bodegas:</h1>
      {content}
    </div>

  }

}
