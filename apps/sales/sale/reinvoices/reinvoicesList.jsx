import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {getPendingReinvoices, setReinvoiceNull} from './actions.js'
import {loadPresaleItem} from '../presales/actions.js'
import {determinClientName, determinClientLastName} from '../../general/clients/actions.js'
import {productSelected} from '../../general/product/actions.js'
import alertify from 'alertifyjs'
import {loadPresaleToPrint} from '../../../../general/printPresale/actions.js'
import SearchAdmin from '../../../../general/search/searchAdmin.jsx'

@connect((store) => {
  return {
    reinvoices: store.reinvoices.reinvoices,
    isVisible: store.reinvoices.isVisible,
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
export default class ReinvoicesPanel extends React.Component {

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
      successType: 'FETCH_REINVOICES_FULFILLED',
      errorType: 'FETCH_REINVOICES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingReinvoices(kwargs))
  }

  hidePanel() {
    this.props.dispatch({type: 'HIDE_REINVOICES_PANEL', payload: -1})
  }

  loadPresaleToCart(id, ev) {
    loadPresaleItem(id, this.props.dispatch)
  }

  loadCart(reinvoice) {
    console.log('ELEMENTO', reinvoice)
    const cart = reinvoice.cart.cartItems
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
    alertify.confirm(`ANULAR RE-FACTURA #${consecutive}`, `¿Desea Anular la re-factura #${consecutive}? Esta acción no se puede deshacer.`, function() {
      const reopenWOPromise = new Promise((resolve, reject) => {
        setReinvoiceNull(id, resolve, reject)
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
    this.props.dispatch({type: 'HIDE_REINVOICES_PANEL', payload: -1})
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'reinvoices-panel is-visible'
      : 'reinvoices-panel'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const reinvoices = this.props.searchResults.length ? this.props.searchResults : this.props.reinvoices
    // const reinvoices = this.props.reinvoices

    const itemsToRender = reinvoices.map(reinvoice => {
      let extras = {
        notes: '',
        client: {
          last_name: 'General',
          name: 'Cliente',
          email: ''
        }
      }

      try {
        extras = reinvoice.extras ? JSON.parse(reinvoice.extras) : extras
      } catch (err) { console.log('ERROR PARSE', err) }
      try {
        reinvoice.user = JSON.parse(reinvoice.user)
      } catch (err) { }
      try {
        reinvoice.cart = JSON.parse(reinvoice.cart)
      } catch (err) { }
      try {
        reinvoice.client = JSON.parse(reinvoice.client)
      } catch (err) { }

      const clientName = determinClientName(reinvoice.client, extras.client)
      const clientLastName = determinClientLastName(reinvoice.client, extras.client)
      const presellerName = reinvoice.user.first_name
        ? `${reinvoice.user.first_name} ${reinvoice.user.last_name}`
        : `${reinvoice.user.username}`
      return <tr key={reinvoice.id}>
        <td className='loadRow'><i onClick={this.loadPresaleToCart.bind(this, reinvoice.id)} className='fa fa-download' /></td>
        <td>{reinvoice.consecutive}</td>
        <td>{`${formatDateTimeAmPm(reinvoice.created)}`}</td>
        <td>{`${clientName} ${clientLastName}`}</td>
        <td>{presellerName}</td>
        <td>₡ {parseFloat(reinvoice.cart.cartTotal).formatMoney(2, ',', '.')}</td>
        <td className='loadRow'><i onClick={this.setNullSinglePresale.bind(this, reinvoice.id, reinvoice.consecutive)} className='fa fa fa-trash' /></td>
      </tr>
    })

    return <div className={isVisible}>
      <div className='reinvoices-panel-header'>
        RE-FACTURAS SIN PROCESAR
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='reinvoices-panel-search'>
        <SearchAdmin model='presale' namespace='presaleSearch' presale_type='QUOTING' />
      </div>
      <div className='reinvoices-panel-container'>

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
