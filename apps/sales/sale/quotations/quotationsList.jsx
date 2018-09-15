import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {loadQuotation, getPendingQuotations, setQuotationNull} from './actions.js'
import {getFullClientById, determinClientName, determinClientLastName} from '../../general/clients/actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {quotations: store.quotations.quotations, isVisible: store.quotations.isVisible}
})
export default class QuotationsPanel extends React.Component {

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
      successType: 'FETCH_QUOTATIONS_FULFILLED',
      errorType: 'FETCH_QUOTATIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingQuotations(kwargs))
  }

  hidePanel() {
    this.props.dispatch({type: 'HIDE_QUOTATIONS_PANEL', payload: -1})
  }

  loadPresaleItem(id, ev) {

    const _this = this
    const url = `/api/presales/${id}`
    const loadPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(loadQuotation(url, resolve, reject))
    })
    loadPromise.then((data) => {
      console.log(data)
      this.props.dispatch({type: 'HIDE_QUOTATIONS_PANEL', payload: -1})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      data.cart = JSON.parse(data.cart)
      data.client = JSON.parse(data.client)
      data.user = JSON.parse(data.user)
      try {
        data.extras = JSON.parse(data.extras)
      } catch (err) { data.extras = null }
      // _this.props.dispatch({type: 'CLIENT_SELECTED', payload: data.client})
      getFullClientById(data.client.id, _this.props.dispatch)
      _this.props.dispatch({type: 'LOAD_CART', payload: data.cart})
      _this.props.dispatch({type: 'SET_PRESALE_ID', payload: data.id})
      _this.props.dispatch({type: 'SET_QUOTATION_ID', payload: data.id})
      _this.props.dispatch({type: 'SET_PRESALE_USER', payload: data.user})
      _this.props.dispatch({type: 'SET_PRESALE_EXTRAS', payload: data.extras})
      _this.props.dispatch({type: 'QUOTATION_LOADED', payload: data.user})
      _this.props.dispatch({type: 'CLEAR_PAY', payload: ''})
    }).catch((err) => {
      if (err.response) {
        alertify.alert('ERROR', `${err.response.data}`)
      } else {
        alertify.alert('ERROR', `Hubo un error al cargar el apartado, error: ${err}`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }

  setNullSinglePresale(id, consecutive) {
    alertify.confirm(`ANULAR COTIZACIÓN #${consecutive}`, `¿Desea Anular la cotización #${consecutive}? Esta acción no se puede deshacer.`, function() {
      const reopenWOPromise = new Promise((resolve, reject) => {
        setQuotationNull(id, resolve, reject)
      })
      reopenWOPromise.then((data) => {
        alertify.alert('COMPLETADO', `Cotización Anulada correctamente`, function() { location.reload() })
      }).catch(err => {
        console.log(err)
        alertify.alert('ERROR', `Hubo un error al intentar anuar la cotización ERROR: ${err}`)
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
      ? 'quotations-panel is-visible'
      : 'quotations-panel'

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const quotations = this.props.quotations

    const itemsToRender = quotations.map(quotation => {
      let extras = {
        notes: '',
        client: {
          last_name: 'General',
          name: 'Cliente',
          email: ''
        }
      }
      try {
        extras = quotation.extras ? JSON.parse(quotation.extras) : extras
      } catch (err) { console.log('ERROR PARSE', err) }
      const clientName = determinClientName(quotation.client, extras.client)
      const clientLastName = determinClientLastName(quotation.client, extras.client)
      const presellerName = quotation.user.first_name
        ? `${quotation.user.first_name} ${quotation.user.last_name}`
        : `${quotation.user.username}`
      return <tr key={quotation.id}>
        <td className='loadRow'><i onClick={this.loadPresaleItem.bind(this, quotation.id)} className='fa fa-download' /></td>
        <td>{quotation.consecutive}</td>
        <td>{`${formatDateTimeAmPm(quotation.created)}`}</td>
        <td>{`${clientName} ${clientLastName}`}</td>
        <td>{presellerName}</td>
        <td>₡ {parseFloat(quotation.cart.cartTotal).formatMoney(2, ',', '.')}</td>
        <td className='loadRow'><i className='fa fa fa-trash' /></td>
        {/* <td className='loadRow'><i onClick={this.setNullSinglePresale.bind(this, quotation.id, quotation.consecutive)} className='fa fa fa-trash' /></td> */}
      </tr>
    })

    return <div className={isVisible}>
      <div className='quotations-panel-header'>
        COTIZACIONES SIN FACTURAR
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='quotations-panel-container'>
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
