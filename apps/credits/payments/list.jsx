/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {generalSave} from '../../../utils/api'
// components
import AdminTable from '../../../general/adminTable/adminTable.jsx'
import { getPaginationItemDispatch } from '../../../utils/api.js'
import Pagination from '../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../general/pagination/resultsPerPage.jsx'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    payments: store.payments.payments,
    pageSize: store.pagination.pageSize
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PAYMENTS', payload: ''})

    const paymentKwargs = {
      url: '/api/creditpaymentslist',
      successType: 'FETCH_PAYMENTS_FULFILLED',
      errorType: 'FETCH_PAYMENTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(paymentKwargs))

  }

  markAsNull(consecutive) {
    const _this = this
    alertify.confirm('ANULAR', `Desea Anular el pago #${consecutive}? Esta acción no se puede
    deshacer.`, function() {
      _this.nullPayment(consecutive)
    }, function() {
      return true
    }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  nullPayment(consecutive) {
    const payments = this.props.payments
    const dispatch = this.props.dispatch
    return (consecutive) => {
      const index = payments.findIndex(a => {
        return a.consecutive === consecutive
      })
      let payment = null
      if (index !== -1) {
        payment = payments[index]
      }
      console.log('Payment -->', payment)

      if (payment !== null) {
        const kwargs = {
          url: '/api/creditpaymentscreate/nullpayment/',
          data: {id: payment.id},
          method: 'post',
          sucessMessage: `Pago anulado Correctamente.`,
          errorMessage: `Hubo un error al anular el pago.`,
          successType: 'FETCHING_DONE',
          errorType: 'FETCHING_DONE'
        }

        dispatch({type: 'FETCHING_STARTED'})
        dispatch(generalSave(kwargs))
      }
    }
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

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='payments' data={payments}
      idField='id' app='credits' />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de pagos a facturas:</h1>
      </div>
      <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div>
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/creditpaymentslist/' successType='FETCH_PAYMENTS_FULFILLED' errorType='FETCH_PAYMENTS_REJECTED' />
        <Pagination url='/api/creditpaymentslist/' successType='FETCH_PAYMENTS_FULFILLED' errorType='FETCH_PAYMENTS_REJECTED' />
      </div>
      {content}
    </div>

  }
}
