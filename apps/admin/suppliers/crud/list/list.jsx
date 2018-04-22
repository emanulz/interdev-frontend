/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import DataTable from '../../../../general/dataTable/dataTable.jsx'
import { getItemDispatch } from '../../../../utils/api.js'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    suppliers: store.suppliers.suppliers
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_SUPPLIER', payload: ''})

    const supplierKwargs = {
      url: '/api/suppliers',
      successType: 'FETCH_SUPPLIERS_FULFILLED',
      errorType: 'FETCH_SUPPLIERS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(supplierKwargs))

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
        field: 'id_num',
        text: 'Identificación'
      }, {
        field: 'phone_number',
        text: 'Teléfono'
      }, {
        field: 'email',
        text: 'Email'
      }, {
        field: 'address',
        text: 'Dirección'
      }
    ]

    const fetching = <div />
    const list = <DataTable headerOrder={headerOrder} model='suppliers' data={this.props.suppliers}
      addLink='/admin/suppliers/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <h1>Listado de Proveedores:</h1>
      {content}
    </div>

  }

}
