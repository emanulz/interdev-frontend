/*
 * Module dependencies
 */
import React from 'react'
import {getItemsListDispatch} from '../../../../utils/api.js'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sellerId: store.sale.seller_id,
    sellers: store.sale.sellers
  }
})
export default class SellerSelector extends React.Component {

  componentDidMount() {
    const sellerKwargs = {
      url: `/api/userprofiles/getSellers/`,
      successType: 'FETCH_SALE_SELLERS_FULFILLED'
    }

    this.props.dispatch(getItemsListDispatch(sellerKwargs))
  }

  sellerSelected(event) {
    const target = event.target
    const value = target.value
    this.props.dispatch({type: 'SET_SALE_SELLER_ID', payload: value})
  }

  doNothing() {

  }

  buildSellersOptions(sellers) {
    const selectOptions = sellers.map(seller => {
      const sellerName = seller.user.first_name ? `${seller.user.first_name} ${seller.user.last_name}` : seller.user.username
      return <option key={seller.id} value={seller.id}>{sellerName}</option>
    })
    selectOptions.unshift(<option key={0} value={0}>{`Sin Vendedor Seleccionado`}</option>)
    return selectOptions
  }

  // Main Layout
  render() {
    const selectOptions = this.props.sellers.length
      ? this.buildSellersOptions(this.props.sellers)
      : <option key={0} value={0}>{`Sin Vendedores Registrados`}</option>
    return <div className='seller-selector'>
      <h2>Selección de Vendedor</h2>
      <select onChange={this.sellerSelected.bind(this)} className='form-control' value={this.props.sellerId} >
        {selectOptions}
      </select>
    </div>
  }

}
