import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {loadRestaurantBill, getPendingRestaurantBills, setRestaurantBillNull} from './actions.js'
import {getFullClientById} from '../../general/clients/actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {restaurantBills: store.restaurantBills.restaurantBills, isVisible: store.restaurantBills.isVisible}
})
export default class RestaurantBillsPanel extends React.Component {

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
      successType: 'FETCH_RESTAURANT_BILLS_FULFILLED',
      errorType: 'FETCH_RESTAURANT_BILLS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingRestaurantBills(kwargs))
  }

  hidePanel() {
    this.props.dispatch({type: 'HIDE_RESTAURANT_BILLS_PANEL', payload: -1})
  }

  loadPresaleItem(id, ev) {

    const _this = this
    const url = `/api/presales/${id}`
    const loadPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(loadRestaurantBill(url, resolve, reject))
    })
    loadPromise.then((data) => {
      console.log(data)
      this.props.dispatch({type: 'HIDE_RESTAURANT_BILLS_PANEL', payload: -1})
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
      _this.props.dispatch({type: 'SET_RESTAURANT_BILL_ID', payload: data.id})
      _this.props.dispatch({type: 'SET_PRESALE_USER', payload: data.user})
      _this.props.dispatch({type: 'SET_PRESALE_EXTRAS', payload: data.extras})
      _this.props.dispatch({type: 'RESTAURANT_BILL_LOADED', payload: data.user})
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
    alertify.confirm(`ANULAR PREVENTA #${consecutive}`, `¿Desea Anular la Preventa #${consecutive}? Esta acción no se puede deshacer.`, function() {
      const reopenWOPromise = new Promise((resolve, reject) => {
        setRestaurantBillNull(id, resolve, reject)
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
      ? 'restaurantBills-panel is-visible'
      : 'restaurantBills-panel'

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const restaurantBills = this.props.restaurantBills

    const itemsToRender = restaurantBills.map(restaurantBill => {
      const presellerName = restaurantBill.user.first_name
        ? `${restaurantBill.user.first_name} ${restaurantBill.user.last_name}`
        : `${restaurantBill.user.username}`
      return <tr key={restaurantBill.id}>
        <td className='loadRow'><i onClick={this.loadPresaleItem.bind(this, restaurantBill.id)} className='fa fa-download' /></td>
        <td>{restaurantBill.consecutive}</td>
        <td>{`${formatDateTimeAmPm(restaurantBill.created)}`}</td>
        <td>{`${restaurantBill.client.name} ${restaurantBill.client.last_name}`}</td>
        <td>{presellerName}</td>
        <td>₡ {parseFloat(restaurantBill.cart.cartTotal).formatMoney(2, ',', '.')}</td>
        <td className='loadRow'><i className='fa fa fa-trash' /></td>
        {/* <td className='loadRow'><i onClick={this.setNullSinglePresale.bind(this, restaurantBill.id, restaurantBill.consecutive)} className='fa fa fa-trash' /></td> */}
      </tr>
    })

    return <div className={isVisible}>
      <div className='restaurantBills-panel-header'>
        CUENTAS DE RESTAURANTE SIN FACTURAR
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='restaurantBills-panel-container'>
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
                <td>Imprimir</td>
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
