/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'
import {loadCashAdvanceToPrint} from '../../../../../general/printCashAdvance/actions.js'
import alertify from 'alertifyjs'
import {markVoucher} from '../../actions.js'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    creditVouchers: store.creditVouchers.creditVouchers,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_CREDIT_VOUCHER', payload: ''})
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const cashAdvanceKwargs = {
      url: `/api/creditvoucherslist/?limit=${this.props.pageSize}&ordering=-created`,
      successType: 'FETCH_CREDIT_VOUCHERS_FULFILLED',
      errorType: 'FETCH_CREDIT_VOUCHERS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(cashAdvanceKwargs))
  }

  reprintCashAdvance(item) {
    this.props.dispatch(loadCashAdvanceToPrint(item))
  }

  markAsApplied(id, consecutive) {
    const _this = this
    alertify.confirm('Descartar', `Desea marcar como aplicado el voucher #${consecutive}? Esta acción no se puede
    deshacer.`, function() {
      _this.markAsAppliedConfirmed(id)
    }, function() {
      return true
    }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  markAsNull(id, consecutive) {
    const _this = this
    alertify.confirm('Anular', `Desea Anuar el voucher #${consecutive}? Esta acción no se puede
    deshacer.`, function() {
      _this.markAsNullConfirmed(id)
    }, function() {
      return true
    }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  markAsAppliedConfirmed(id) {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    // TODO INSERT THE PATH TO MARK AS APPLIED
    const kwargs = {
      url: `/markAsAppliedPath`,
      errorMessage: 'Error al marcar el voucer como aplicado'
    }
    const _this = this
    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      markVoucher(kwargs, resolve, reject)
    })
    // SAVE PROCESS
    updatePromise.then((data) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('COMPLETADO', 'VOUCHER MARCADO COMO APLICADO CORRECTAMENTE')
    }).catch((err) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
    })
  }

  markAsNullConfirmed(id) {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    // TODO INSERT THE PATH TO MARK AS NULL
    const kwargs = {
      url: `/nullVoucherPath`,
      errorMessage: 'Error al Anular el Voucher'
    }
    const _this = this
    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      // USES THE SAME METHOD FOR MARK, AS THE FUNCTION ONLY NEEDS AN ENDPOINT TO WORK
      markVoucher(kwargs, resolve, reject)
    })
    // SAVE PROCESS
    updatePromise.then((data) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('COMPLETADO', 'VOUCHER ANULADO CORRECTAMENTE')
    }).catch((err) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
    })
  }

  render() {

    const getClientNameClosure = (item) => {
      function getName(item) {
        if (item == undefined || item.client == '') {
          return 'SIN NOMBRE'
        }
        try {
          const client = JSON.parse(item)
          return `${client.name} ${client.last_name}`
        } catch (err) { console.log(err) }
        return 'ERROR EN NOMBRE'
      }
      return getName(item)
    }

    const getVoucherTypeClosure = (item) => {
      function getType(item) {
        if (item == 'CASH_ADVANCE') {
          return 'ADELANTO DE EFECTIVO'
        }
        if (item == 'CREDIT_NOTE') {
          return 'NOTA DE CRÉDITO'
        }
        return 'SIN TIPO CONOCIDO'
      }
      return getType(item)
    }

    const determinMarkAsApplied = (item) => {
      const _this = this
      function MarkAsAppliedAction(item) {
        if (item.voucher_applied) {
          return 'YA APLICADO'
        }
        if (item.to_cash) {
          return 'YA APLICADO'
        }
        if (item.is_null) {
          return 'YA ANULADO'
        }
        if (!item.voucher_applied && !item.to_cash && !item.is_null) {
          return <button onClick={_this.markAsApplied.bind(_this, item.id, item.consecutive)} className='btn btn-success'>MARCAR APLICADO</button>
        }
        return 'ESTADO DESCONOCIDO'
      }
      return MarkAsAppliedAction(item)
    }

    const determinNullAction = (item) => {
      const _this = this
      function NullAction(item) {
        if (item.voucher_applied) {
          return 'YA APLICADO'
        }
        if (item.to_cash) {
          return 'YA APLICADO'
        }
        if (item.is_null) {
          return 'YA ANULADO'
        }
        if (!item.voucher_applied && !item.to_cash && !item.is_null) {
          return <button onClick={_this.markAsNull.bind(_this, item.id, item.consecutive)} className='btn btn-success'>ANULAR</button>
        }
        return 'ESTADO DESCONOCIDO'
      }
      return NullAction(item)
    }

    const headerOrder = [
      {
        field: 'consecutive',
        text: 'Consecutivo'
      }, {
        type: 'function_process',
        field: 'client',
        text: 'Cliente',
        worker_method: getClientNameClosure
      }, {
        field: 'amount',
        text: 'Monto',
        type: 'price'
      }, {
        field: 'description',
        text: 'Descripción'
      }, {
        type: 'function_process',
        field: 'voucher_type',
        text: 'Tipo',
        worker_method: getVoucherTypeClosure
      }, {
        type: 'function_element_double',
        field: 'id',
        text: 'Marcar Aplicado',
        number: '1',
        worker_method: determinMarkAsApplied
      }, {
        type: 'function_element_double',
        field: 'id',
        text: 'Anular',
        number: '2',
        worker_method: determinNullAction
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.creditVouchers
    const list = <AdminTable headerOrder={headerOrder} model='creditvoucher' data={tableData}
      idField='id' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/creditvoucherslist/' successType='FETCH_CREDIT_VOUCHERS_FULFILLED' errorType='FETCH_CREDIT_VOUCHERS_REJECTED' />
        <Pagination url='/api/creditvoucherslist/' successType='FETCH_CREDIT_VOUCHERS_FULFILLED' errorType='FETCH_CREDIT_VOUCHERS_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Vouchers:</h1>
      </div>
      <SearchAdmin model='credit_voucher' namespace='adminSearch' />
      {paginationDiv}
      {/* <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/cashAdvances/' successType='FETCH_CREDIT_VOUCHERS_FULFILLED' errorType='FETCH_CREDIT_VOUCHERS_REJECTED' />
        <Pagination url='/api/cashAdvances/' successType='FETCH_CREDIT_VOUCHERS_FULFILLED' errorType='FETCH_CREDIT_VOUCHERS_REJECTED' />
      </div> */}
      {content}
    </div>

  }

}
