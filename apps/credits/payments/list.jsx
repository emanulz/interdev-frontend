/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getPaymentDispatch} from './actions.js'

// components
import DataTable from '../../../general/dataTable/dataTable.jsx'

@connect((store) => {
  return {
    payments: store.payments.payments
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PAYMENTS', payload: ''})

    const paymentKwargs = {
      url: '/api/creditpayments',
      successType: 'FETCH_PAYMENTS_FULFILLED',
      errorType: 'FETCH_PAYMENTS_REJECTED'
    }

    this.props.dispatch(getPaymentDispatch(paymentKwargs))

  }

  // Render the product
  render() {
    const payments = this.props.payments

    const headerOrder = [
      {
        field: 'consecutive',
        text: 'Número',
        type: 'primaryNoEdit'
      }, {
        field: 'client.name',
        text: 'Nombre',
        type: 'text'
      }, {
        field: 'client.last_name',
        text: 'Apellidos',
        type: 'text'
      },
      {
        field: 'created',
        text: 'Fecha',
        type: 'date'
      },
      {
        field: 'amount',
        text: 'Monto',
        type: 'price'
      },
      {
        field: 'is_null',
        text: 'Anulado?',
        type: 'bool'
      },
      {
        field: 'consecutive',
        text: 'Pago',
        textToRender: 'Ver Pago',
        type: 'textLink'
      }
    ]

    const list = <DataTable headerOrder={headerOrder} model='receivable' data={payments} app='credits'
      addLink='' idField='id' />
    const fetching = <div />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <h1>Listado de Pagos de crédito:</h1>
      {content}
    </div>

  }
}
