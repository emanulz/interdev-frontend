import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {loadNSReserve, getPendingNSReserves, setNSReserveNull} from './actions.js'
import {getFullClientById, determinClientName, determinClientLastName} from '../../general/clients/actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {nsreserves: store.nsreserves.nsreserves, isVisible: store.nsreserves.isVisible}
})
export default class NSReservesPanel extends React.Component {

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
      successType: 'FETCH_NSRESERVES_FULFILLED',
      errorType: 'FETCH_NSRESERVES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingNSReserves(kwargs))
  }

  hidePanel() {
    this.props.dispatch({type: 'HIDE_NSRESERVES_PANEL', payload: -1})
  }

  loadPresaleItem(id, ev) {

    const _this = this
    const url = `/api/presales/${id}`
    const loadPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(loadNSReserve(url, resolve, reject))
    })
    loadPromise.then((data) => {
      console.log(data)
      this.props.dispatch({type: 'HIDE_NSRESERVES_PANEL', payload: -1})
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
      _this.props.dispatch({type: 'LOAD_CART', payload: _this.checkAndFixCartIVA(data.cart)})
      _this.props.dispatch({type: 'SET_PRESALE_ID', payload: data.id})
      _this.props.dispatch({type: 'SET_NSRESERVE_ID', payload: data.id})
      _this.props.dispatch({type: 'SET_PRESALE_USER', payload: data.user})
      _this.props.dispatch({type: 'SET_PRESALE_EXTRAS', payload: data.extras})
      _this.props.dispatch({type: 'NSRESERVE_LOADED', payload: data.user})
      _this.props.dispatch({type: 'CLEAR_PAY', payload: ''})
      this.loadAdvances(data)
    }).catch((err) => {
      if (err.response) {
        alertify.alert('ERROR', `${err.response.data}`)
      } else {
        alertify.alert('ERROR', `Hubo un error al cargar el apartado, error: ${err}`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }

  checkAndFixCartIVA(cart) {
    cart.cartItems.forEach(line => {
      if (!line.product.taxes_IVA) {
        line.product.tax_code_IVA = '01'
        if (parseFloat(line.product.taxes) == 0 || !line.product.use_taxes) {
          line.product.rate_code_IVA = '01'
          line.product.taxes_IVA = '0.00000'
        } else {
          line.product.rate_code_IVA = '08'
          line.product.taxes_IVA = '13.00000'
        }
      }
    })
    return cart
  }

  setNullSinglePresale(id, consecutive) {
    alertify.confirm(`ANULAR PREVENTA #${consecutive}`, `¿Desea Anular la Preventa #${consecutive}? Esta acción no se puede deshacer.`, function() {
      const reopenWOPromise = new Promise((resolve, reject) => {
        setNSReserveNull(id, resolve, reject)
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

  loadAdvances(presale) {
    console.log('PRESALE', presale)
    const advancesAmount = parseFloat(presale.cart.cartTotal) - parseFloat(presale.balance)
    const advance = {'type': 'CSHA', 'amount': advancesAmount, 'presaleId': presale.id}
    this.props.dispatch({type: 'ADD_CASH_ADVANCE', payload: advance})
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'nsreserves-panel is-visible'
      : 'nsreserves-panel'

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nsreserves = this.props.nsreserves

    const itemsToRender = nsreserves.map(nsreserve => {
      let extras = {
        notes: '',
        client: {
          last_name: 'General',
          name: 'Cliente',
          email: ''
        }
      }
      try {
        extras = nsreserve.extras ? JSON.parse(nsreserve.extras) : extras
      } catch (err) { console.log('ERROR PARSE', err) }
      const clientName = determinClientName(nsreserve.client, extras.client)
      const clientLastName = determinClientLastName(nsreserve.client, extras.client)
      const presellerName = nsreserve.user.first_name
        ? `${nsreserve.user.first_name} ${nsreserve.user.last_name}`
        : `${nsreserve.user.username}`
      return <tr key={nsreserve.id}>
        <td className='loadRow'><i onClick={this.loadPresaleItem.bind(this, nsreserve.id)} className='fa fa-download' /></td>
        <td>{nsreserve.consecutive}</td>
        <td>{`${formatDateTimeAmPm(nsreserve.created)}`}</td>
        <td>{`${clientName} ${clientLastName}`}</td>
        <td>{presellerName}</td>
        <td>₡{parseFloat(nsreserve.cart.cartTotal).formatMoney(2, ',', '.')}</td>
        <td>₡{parseFloat(nsreserve.balance).formatMoney(2, ',', '.')}</td>
        {/* <td className='loadRow'><i onClick={this.setNullSinglePresale.bind(this, nsreserve.id, nsreserve.consecutive)} className='fa fa fa-trash' /></td> */}
      </tr>
    })

    return <div className={isVisible}>
      <div className='nsreserves-panel-header'>
        APARTADOS SIN FACTURAR
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='nsreserves-panel-container'>
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
                <td>Por Pagar</td>
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
