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
    clients: store.clients.clients
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})

    const clientKwargs = {
      url: '/api/clients',
      successType: 'FETCH_CLIENTS_FULFILLED',
      errorType: 'FETCH_CLIENTS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(clientKwargs))

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
        field: 'last_name',
        text: 'Apellido'
      }, {
        field: 'id_num',
        text: 'Identificación'
      }, {
        field: 'has_credit',
        text: 'Tiene Crédito',
        type: 'bool'
      }, {
        field: 'credit_limit',
        text: 'Límite de crédito',
        type: 'price'
      }, {
        field: 'credit_days',
        text: 'Días de crédito'
      }
    ]

    const fetching = <div />
    const list = <DataTable headerOrder={headerOrder} model='clients' data={this.props.clients}
      addLink='/admin/clients/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <h1>Listado de Clientes:</h1>
      {content}
    </div>

  }

}
