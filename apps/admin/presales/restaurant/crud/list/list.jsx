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
import {loadSaleToReprint} from '../../../../../../general/reprintInvoice/actions.js'
import alertify from 'alertifyjs'
import {destroyPresale} from '../../../actions.js'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    presales: store.presales.restaurant,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

    const presaleKwargs = {
      url: `/api/presales/?presale_type=RESTAURANT&limit=${this.props.pageSize}&ordering=-consecutive`,
      successType: 'FETCH_RESTAURANT_PRESALES_FULFILLED',
      errorType: 'FETCH_RESTAURANT_PRESALES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(presaleKwargs))
  }

  reprintInvoice(item) {
    this.props.dispatch(loadSaleToReprint(item))
  }

  markAsDestroyed(id) {
    const _this = this
    alertify.confirm('Eliminar', `Desea marcar la cuenta de restaurante como no satisfecho? Esta acción no se puede
    deshacer.`, function() {
      _this.markAsDestroyedConfirmed(id)
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
      errorMessage: 'Error al marcar la Orden como no satisfecho'
    }
    const _this = this
    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      destroyPresale(kwargs, resolve, reject)
    })
    // SAVE PROCESS
    updatePromise.then((data) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('COMPLETADO', 'ORDEN DE RESTAURANTE MARCADA COMO NO SATISFECHO CORRECTAMENTE.')
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
        if (item.presale_type != 'RESTAURANT') {
          return 'NO RESTAURANTE'
        }
        if (item.destroyed) {
          return 'YA MARCADA'
        }
        if (item.billed) {
          return 'COBRADA'
        }
        if (item.is_null) {
          return 'ANULADA'
        }
        if (!item.closed) {
          return 'ORDEN EN PROCESO'
        }
        if (!item.destroyed && !item.billed && !item.is_null && item.closed) {
          return <button onClick={_this.markAsDestroyed.bind(_this, item.id)} className='btn btn-success'>NO SATISFECHO</button>
        }
        return 'ESTADO DESCONOCIDO'
      }
      return DestroyAction(item)
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
        type: 'function_element',
        field: 'id',
        text: 'Cliente No Satisfecho',
        worker_method: determinDestroyAction
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.presales
    const list = <AdminTable headerOrder={headerOrder} model='presales' data={tableData}
      idField='id' />

    const content = this.props.fetching ? fetching : list

    const paginationDiv = !this.props.searchResults.length
      ? <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/presales/?presale_type=RESTAURANT' successType='FETCH_RESTAURANT_PRESALES_FULFILLED' errorType='FETCH_RESTAURANT_PRESALES_REJECTED' />
        <Pagination url='/api/presales/?presale_type=RESTAURANT' successType='FETCH_RESTAURANT_PRESALES_FULFILLED' errorType='FETCH_RESTAURANT_PRESALES_REJECTED' />
      </div>
      : <div />

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Listado de Cuentas de Restaurante:</h1>
      </div>
      {/* <SearchAdmin model='presale' namespace='adminSearch' /> */}
      {paginationDiv}
      {content}
    </div>

  }

}
