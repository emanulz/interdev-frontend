import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {loadPresale, getPendingPresales, setPresaleNull} from './actions.js'
import {getFullClientById, determinClientName, determinClientLastName} from '../../general/clients/actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {presales: store.presales.presales, isVisible: store.presales.isVisible, extraClient: store.extras.client}
})
export default class PresalesPanel extends React.Component {

  componentWillMount() {
    const kwargs = {
      url: '/api/presales',
      ordering: '-consecutive',
      filterField: 'closed',
      filter: 'True',
      filterField2: 'billed',
      filter2: 'False',
      filterField3: 'is_null',
      filter3: 'False',
      successType: 'FETCH_PRESALES_FULFILLED',
      errorType: 'FETCH_PRESALES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingPresales(kwargs))
  }

  hidePanel() {
    this.props.dispatch({type: 'HIDE_PRESALES_PANEL', payload: -1})
  }

  loadPresaleItem(id, ev) {

    const _this = this
    const url = `/api/presales/${id}`
    const loadPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(loadPresale(url, resolve, reject))
    })
    loadPromise.then((data) => {
      console.log(data)
      this.props.dispatch({type: 'HIDE_PRESALES_PANEL', payload: -1})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      data.cart = JSON.parse(data.cart)
      data.client = JSON.parse(data.client)
      data.user = JSON.parse(data.user)
      try {
        data.extras = JSON.parse(data.extras)
        _this.props.dispatch({type: 'SET_CURRENCY', payload: data.currency_code})
      } catch (err) { data.extras = null }
      // _this.props.dispatch({type: 'CLIENT_SELECTED', payload: data.client})
      getFullClientById(data.client.id, _this.props.dispatch)
      _this.props.dispatch({type: 'LOAD_CART', payload: data.cart})
      _this.props.dispatch({type: 'SET_PRESALE_ID', payload: data.id})
      _this.props.dispatch({type: 'SET_PRESALE_USER', payload: data.user})
      _this.props.dispatch({type: 'SET_PRESALE_EXTRAS', payload: data.extras})
      _this.props.dispatch({type: 'PRESALE_LOADED', payload: data.user})
      _this.props.dispatch({type: 'CLEAR_PAY', payload: ''})
    }).catch((err) => {
      if (err.response) {
        alertify.alert('ERROR', `${err.response.data}`)
      } else {
        alertify.alert('ERROR', `Hubo un error al cargar la preventa, error: ${err}`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }

  setNullSinglePresale(id, consecutive) {
    alertify.confirm(`ANULAR PREVENTA #${consecutive}`, `¿Desea Anular la Preventa #${consecutive}? Esta acción no se puede deshacer.`, function() {
      const reopenWOPromise = new Promise((resolve, reject) => {
        setPresaleNull(id, resolve, reject)
      })
      reopenWOPromise.then((data) => {
        alertify.alert('COMPLETADO', `Preventa Anulada correctamente`, function() { location.reload() })
      }).catch(err => {
        console.log(err)
        alertify.alert('ERROR', `Hubo un error al intentar anuar la preventa ERROR: ${err}`)
      })
    }, function() {
      return true
    }).set('labels', {
      ok: 'Anular',
      cancel: 'Cancelar'
    })
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'presales-panel is-visible'
      : 'presales-panel'

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const presales = this.props.presales

    const itemsToRender = presales.map(presale => {
      let extras = {
        notes: '',
        client: {
          last_name: 'General',
          name: 'Cliente',
          email: ''
        }
      }
      try {
        extras = presale.extras ? JSON.parse(presale.extras) : extras
      } catch (err) { console.log('ERROR PARSE', err) }
      const clientName = determinClientName(presale.client, extras.client)
      const clientLastName = determinClientLastName(presale.client, extras.client)
      const presellerName = presale.user.first_name
        ? `${presale.user.first_name} ${presale.user.last_name}`
        : `${presale.user.username}`
      return <tr key={presale.id}>
        <td className='loadRow'><i onClick={this.loadPresaleItem.bind(this, presale.id)} className='fa fa-download' /></td>
        <td>{presale.consecutive}</td>
        <td>{`${formatDateTimeAmPm(presale.created)}`}</td>
        <td>{`${clientName} ${clientLastName}`}</td>
        <td>{presellerName}</td>
        <td>₡ {parseFloat(presale.cart.cartTotal).formatMoney(2, ',', '.')}</td>
        <td className='loadRow'><i onClick={this.setNullSinglePresale.bind(this, presale.id, presale.consecutive)} className='fa fa fa-trash' /></td>
      </tr>
    })

    return <div className={isVisible}>
      <div className='presales-panel-header'>
        PREVENTAS SIN FACTURAR
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='presales-panel-container'>
        <div className='col-xs-12'>
          <table className='table'>
            <thead>
              <tr>
                <td>Cargar</td>
                <td>#</td>
                <td>Fecha</td>
                <td>Cliente</td>
                <td>Vendedor</td>
                <td>Monto</td>
                <td>Anular</td>
              </tr>
            </thead>
            <tbody>
              {itemsToRender}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  }

}
