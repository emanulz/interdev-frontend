/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../../../utils/api.js'
import Pagination from '../../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../../general/pagination/resultsPerPage.jsx'
import {loadPresaleToPrint} from '../../../../../../general/printPresale/actions.js'
import {destroyPresale} from '../../../actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    presales: store.presales.nsreserves,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const presaleKwargs = {
      url: `/api/presales/?presale_type=NS_RESERVE&limit=${this.props.pageSize}&ordering=-consecutive`,
      successType: 'FETCH_NSRESERVES_PRESALES_FULFILLED',
      errorType: 'FETCH_NSRESERVES_PRESALES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(presaleKwargs))
  }

  reprintPresale(item) {
    this.props.dispatch(loadPresaleToPrint(item))
  }

  markAsDestroyed(id, consecutive) {
    const _this = this
    alertify.confirm('Descartar', `Desea descartar el apartado #${consecutive}? Esta acción no se puede
    deshacer.`, function() {
      _this.markAsDestroyedConfirmed(id)
    }, function() {
      return true
    }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  markAsNull(id, consecutive) {
    const _this = this
    alertify.confirm('Anular', `Desea Anuar el apartado #${consecutive}? Esta acción no se puede
    deshacer.`, function() {
      _this.markAsNullConfirmed(id)
    }, function() {
      return true
    }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  markAsDestroyedConfirmed(id) {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    const kwargs = {
      url: `/api/presalespatch/${id}/destroy_presale/`,
      errorMessage: 'Error al descartar la reserva'
    }
    const _this = this
    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      destroyPresale(kwargs, resolve, reject)
    })
    // SAVE PROCESS
    updatePromise.then((data) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('COMPLETADO', 'RESERVA DESCARTADA CORRECTAMENTE')
    }).catch((err) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
    })
  }

  markAsNullConfirmed(id) {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    const kwargs = {
      url: `/api/presalespatch/${id}/set_null/`,
      errorMessage: 'Error al Anular la reserva'
    }
    const _this = this
    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      // USES THE SAME METHOD FOR DESTROY, AS THE FUNCTION ONLY NEEDS AN ENDPOINT TO WORK
      destroyPresale(kwargs, resolve, reject)
    })
    // SAVE PROCESS
    updatePromise.then((data) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('COMPLETADO', 'RESERVA ANULADA CORRECTAMENTE')
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

    const determinDestroyAction = (item) => {
      const _this = this
      function DestroyAction(item) {
        if (item.presale_type != 'NSRESERVE') {
          return 'NO APARTADO'
        }
        if (item.destroyed) {
          return 'YA MARCADO'
        }
        if (item.billed) {
          return 'COBRADO'
        }
        if (item.is_null) {
          return 'ANULADO'
        }
        if (!item.closed) {
          return 'EN CAJA'
        }
        if (!item.destroyed && !item.billed && !item.is_null && item.closed) {
          return <button onClick={_this.markAsDestroyed.bind(_this, item.id, item.consecutive)} className='btn btn-success'>DESCARTAR</button>
        }
        return 'ESTADO DESCONOCIDO'
      }
      return DestroyAction(item)
    }

    const determinNullAction = (item) => {
      const _this = this
      function NullAction(item) {
        if (item.presale_type != 'NSRESERVE') {
          return 'NO APARTADO'
        }
        if (item.destroyed) {
          return 'DESCARTADO'
        }
        if (item.billed) {
          return 'COBRADO'
        }
        if (item.is_null) {
          return 'YA ANULADO'
        }
        if (!item.closed) {
          return 'EN CAJA'
        }
        if (!item.destroyed && !item.billed && !item.is_null && item.closed) {
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
        text: 'Cliente Hacienda',
        worker_method: getClientNameClosure
      }, {
        type: 'CLIENT_NAME_EXTRAS',
        field: 'client',
        text: 'Nombre en Factura'
      }, {
        type: 'function_element_double',
        field: 'id',
        text: 'Descartar',
        number: '1',
        worker_method: determinDestroyAction
      }, {
        type: 'function_element_double',
        field: 'id',
        text: 'Anular',
        number: '2',
        worker_method: determinNullAction
      }, {
        field: 'consecutive',
        text: 'Recibo',
        type: 'function_on_click',
        textToRender: 'Ver',
        onClickFunction: this.reprintPresale
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.presales
    const list = <AdminTable headerOrder={headerOrder} model='presales' data={tableData}
      idField='id' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/presales/?presale_type=NS_RESERVE' successType='FETCH_NSRESERVES_PRESALES_FULFILLED' errorType='FETCH_NSRESERVES_PRESALES_REJECTED' />
        <Pagination url='/api/presales/?presale_type=NS_RESERVE' successType='FETCH_NSRESERVES_PRESALES_FULFILLED' errorType='FETCH_NSRESERVES_PRESALES_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Apartados:</h1>
      </div>
      {/* <SearchAdmin model='presale' namespace='adminSearch' /> */}
      <SearchAdmin model='presale' namespace='adminSearch' presale_type='NSRESERVE' />
      {paginationDiv}
      {content}
    </div>

  }

}
