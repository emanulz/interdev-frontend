import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {loadQuotation, setQuotationNull} from './actions.js'
import {loadPresaleItem} from '../presales/actions.js'
import {getFullClientById, determinClientName, determinClientLastName} from '../../general/clients/actions.js'
import {productSelected} from '../../general/product/actions.js'
import alertify from 'alertifyjs'
import {loadPresaleToPrint} from '../../../../general/printPresale/actions.js'
import SearchAdmin from '../../../../general/search/searchAdmin.jsx'

@connect((store) => {
  return {
    quotations: store.quotations.quotations,
    isVisible: store.quotations.isVisible,
    client: store.clients.clientSelected,
    itemsInCart: store.cart.cartItems,
    inputVal: store.products.inputVal,
    globalDiscount: store.cart.globalDiscount,
    warehouse_id: store.userProfile.salesWarehouse,
    priceListSelected: store.priceList.listSelected,
    usePriceListAsDefault: store.priceList.useAsDefault,
    searchResults: store.presaleSearch.searchResults
  }
})
export default class QuotationsPanel extends React.Component {

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
    //   successType: 'FETCH_QUOTATIONS_FULFILLED',
    //   errorType: 'FETCH_QUOTATIONS_REJECTED'
    // }
    // this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    // this.props.dispatch(getPendingQuotations(kwargs))
  }

  hidePanel() {
    this.props.dispatch({type: 'HIDE_QUOTATIONS_PANEL', payload: -1})
  }

  // THIS FUNCTION IS NOT ON USE SINCE FEB 1st 2019
  loadPresaleItemDEPRECATED(id, ev) {

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
        _this.props.dispatch({type: 'SET_CURRENCY', payload: data.currency_code})
      } catch (err) { data.extras = null }
      // _this.props.dispatch({type: 'CLIENT_SELECTED', payload: data.client})
      _this.props.dispatch({type: 'SET_PRESALE_ID', payload: data.id})
      _this.props.dispatch({type: 'SET_QUOTATION_ID', payload: data.id})
      _this.props.dispatch({type: 'SET_PRESALE_USER', payload: data.user})
      _this.props.dispatch({type: 'SET_PRESALE_EXTRAS', payload: data.extras})
      // _this.props.dispatch({type: 'LOAD_CART', payload: data.cart})
      _this.props.dispatch({type: 'QUOTATION_LOADED', payload: data.user})
      _this.props.dispatch({type: 'CLEAR_PAY', payload: ''})
      getFullClientById(data.client.id, _this.props.dispatch)
      _this.loadCart(data)
    }).catch((err) => {
      if (err.response) {
        alertify.alert('ERROR', `${err.response.data}`)
      } else {
        alertify.alert('ERROR', `Hubo un error al cargar la cotización, error: ${err}`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }

  loadPresaleToCart(id, ev) {
    loadPresaleItem(id, this.props.dispatch)
  }

  loadCart(quotation) {
    console.log('ELEMENTO', quotation)
    const cart = quotation.cart.cartItems
    const _this = this
    for (const item in cart) {

      console.log('PRODUCT', cart[item].product)
      const oldProduct = cart[item].product
      const price1 = oldProduct.price ? oldProduct.price : oldProduct.price1
      oldProduct.price1 = price1
      // FIX FOR TAXES ON PRODUCT WITH NO IVA
      if (!oldProduct.taxes_IVA) {
        oldProduct.tax_code_IVA = '01'
        if (parseFloat(oldProduct.taxes) == 0) {
          oldProduct.rate_code_IVA = '01'
          oldProduct.taxes_IVA = '0.00000'
        } else {
          oldProduct.rate_code_IVA = '08'
          oldProduct.taxes_IVA = '13.00000'
        }
      }
      const lineData = {
        default_discount: cart[item].discount,
        id: oldProduct.id,
        max_discount: '100',
        product: oldProduct,
        table_price: '0',
        target_price_list: 'price1'
      }
      _this.props.dispatch({type: 'ADD_TO_PRICES_DETAILS', payload: lineData})
      try {
        _this.props.dispatch(
          productSelected(
            lineData,
            parseFloat(cart[item].qty),
            _this.props.itemsInCart,
            _this.props.client,
            _this.props.warehouse_id,
            true,
            _this.props.priceListSelected,
            _this.props.usePriceListAsDefault
          )
        )
      } catch (err) {
        console.log(err)
      }

    }

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

  printPresale(id) {
    this.props.dispatch(loadPresaleToPrint(id))
    this.props.dispatch({type: 'HIDE_QUOTATIONS_PANEL', payload: -1})
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'quotations-panel is-visible'
      : 'quotations-panel'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const quotations = this.props.searchResults.length ? this.props.searchResults : this.props.quotations
    // const quotations = this.props.quotations

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
      try {
        quotation.user = JSON.parse(quotation.user)
      } catch (err) { }
      try {
        quotation.cart = JSON.parse(quotation.cart)
      } catch (err) { }
      try {
        quotation.client = JSON.parse(quotation.client)
      } catch (err) { }

      const clientName = determinClientName(quotation.client, extras.client)
      const clientLastName = determinClientLastName(quotation.client, extras.client)
      const presellerName = quotation.user.first_name
        ? `${quotation.user.first_name} ${quotation.user.last_name}`
        : `${quotation.user.username}`
      return <tr key={quotation.id}>
        <td className='loadRow'><i onClick={this.loadPresaleToCart.bind(this, quotation.id)} className='fa fa-download' /></td>
        <td>{quotation.consecutive}</td>
        <td>{`${formatDateTimeAmPm(quotation.created)}`}</td>
        <td>{`${clientName} ${clientLastName}`}</td>
        <td>{presellerName}</td>
        <td>₡ {parseFloat(quotation.cart.cartTotal).formatMoney(2, ',', '.')}</td>
        <td className='loadRow'><i onClick={this.setNullSinglePresale.bind(this, quotation.id, quotation.consecutive)} className='fa fa fa-trash' /></td>
        <td className='loadRow'><i className='fa fa-print' onClick={this.printPresale.bind(this, quotation.consecutive)} /></td>
      </tr>
    })

    return <div className={isVisible}>
      <div className='quotations-panel-header'>
        COTIZACIONES SIN FACTURAR
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='quotations-panel-search'>
        <SearchAdmin model='presale' namespace='presaleSearch' presale_type='QUOTING' />
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
                <td>Reimprimir</td>
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
