/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getItemDispatch} from '../../../utils/api'

// components
import DataTable from '../../../general/dataTable/dataTable.jsx'

@connect((store) => {
  return {
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

  // Render the product
  render() {
    const clients = this.props.clients

    const dataFiltered = clients.filter(el => el.debt > 0 || el.has_credit)

    const headerOrder = [
      {
        field: 'code',
        text: 'Código',
        type: 'primaryNoEdit'
      }, {
        field: 'name',
        text: 'Nombre',
        type: 'text'
      }, {
        field: 'last_name',
        text: 'Apellido',
        type: 'text'
      },
      {
        field: 'debt',
        text: 'Saldo',
        type: 'price'
      },
      {
        field: 'code',
        text: 'Estado de Cuenta',
        textToRender: 'Ver Estado',
        type: 'textLink'
      }
    ]

    const list = <DataTable headerOrder={headerOrder} model='receivable' data={dataFiltered} app='credits'
      addLink='' idField='id' />
    const fetching = <div />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <h1>Listado de Cuentas por Cobrar:</h1>
      {content}
    </div>

  }
}
