import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {loadRestaurantBill, setRestaurantBillNull} from './actions.js'
import {getFullClientById, determinClientName, determinClientLastName} from '../../general/clients/actions.js'
import {getSingleItemDispatch} from '../../../../utils/api.js'
import alertify from 'alertifyjs'
import {loadPresaleToPrint} from '../../../../general/printPresale/actions.js'

@connect((store) => {
  return {
    restaurantBills: store.restaurantBills.restaurantBills,
    isVisible: store.restaurantBills.isVisible,
    percent10: store.restaurantBills.percent10
  }
})
export default class RestaurantBillsPanel extends React.Component {

  componentWillMount() {
    // const kwargs = {
    //   url: '/api/presales',
    //   ordering: '-consecutive',
    //   filterField: 'closed',
    //   filter: 'True',
    //   filterField2: 'billed',
    //   filter2: 'False',
    //   filterField3: 'is_null',
    //   filter3: 'False',
    //   filterField4: 'destroyed',
    //   filter4: 'False',
    //   successType: 'FETCH_RESTAURANT_BILLS_FULFILLED',
    //   errorType: 'FETCH_RESTAURANT_BILLS_REJECTED'
    // }
    // this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    // this.props.dispatch(getPendingRestaurantBills(kwargs))
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
        _this.props.dispatch({type: 'SET_CURRENCY', payload: data.currency_code})
      } catch (err) { data.extras = null }
      // _this.props.dispatch({type: 'CLIENT_SELECTED', payload: data.client})
      getFullClientById(data.client.id, _this.props.dispatch)
      _this.props.dispatch({type: 'LOAD_CART', payload: data.cart})
      _this.props.dispatch({type: 'SET_PRESALE_ID', payload: data.id})
      _this.props.dispatch({type: 'SET_RESERVE_ID', payload: data.id})
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

  printPresale(id) {
    this.props.dispatch(loadPresaleToPrint(id))
  }

  get10Percent() {
    const kwargs = {
      url: '/api/saleslist/getserviceamount',
      successType: 'SET_PERCENT_10',
      errorType: 'CLEAR_PERCENT_10'
    }
    this.props.dispatch(getSingleItemDispatch(kwargs))
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'restaurantBills-panel is-visible'
      : 'restaurantBills-panel'

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const restaurantBills = this.props.restaurantBills

    const itemsToRender = restaurantBills.map(restaurantBill => {
      let extras = {
        notes: '',
        client: {
          last_name: 'General',
          name: 'Cliente',
          email: '',
          tableName: 'Sin Mesa'
        }
      }
      try {
        extras = restaurantBill.extras ? JSON.parse(restaurantBill.extras) : extras
      } catch (err) { console.log('ERROR PARSE', err) }
      const clientName = determinClientName(restaurantBill.client, extras.client)
      const clientLastName = determinClientLastName(restaurantBill.client, extras.client)
      const tableName = extras.tableName ? extras.tableName : '-'
      return <tr key={restaurantBill.id}>
        <td className='loadRow'><i onClick={this.loadPresaleItem.bind(this, restaurantBill.id)} className='fa fa-download' /></td>
        <td>{restaurantBill.consecutive}</td>
        <td>{`${formatDateTimeAmPm(restaurantBill.created)}`}</td>
        <td>{`${clientName} ${clientLastName}`}</td>
        <td>{tableName}</td>
        <td>₡ {parseFloat(restaurantBill.cart.cartTotal).formatMoney(2, ',', '.')}</td>
        <td className='loadRow'><i className='fa fa-print' onClick={this.printPresale.bind(this, restaurantBill.consecutive)} /></td>
        {/* <td className='loadRow'><i onClick={this.setNullSinglePresale.bind(this, restaurantBill.id, restaurantBill.consecutive)} className='fa fa fa-trash' /></td> */}
      </tr>
    })

    return <div className={isVisible}>
      <div className='restaurantBills-panel-header'>
        CUENTAS DE RESTAURANTE SIN FACTURAR
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='restaurantBills-panel-percent10'>
        <button onClick={this.get10Percent.bind(this)}>CALCULAR 10%</button>
        <span>₡{parseFloat(this.props.percent10).formatMoney()}</span>
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
                <td>Mesa</td>
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
