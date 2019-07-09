/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {productSelected} from '../actions.js'
import { getItemDispatch } from '../../../../../utils/api'
import Select2 from 'react-select2-wrapper'

@connect((store) => {
  return {
    isVisible: store.generalItem.isVisible,
    product: store.generalItem.product,
    qty: store.generalItem.qty,
    client: store.clients.clientSelected,
    itemsInCart: store.cart.cartItems,
    globalDiscount: store.cart.globalDiscount,
    warehouse_id: store.userProfile.salesWarehouse,
    disabled: store.completed.completed,
    config: store.config.globalConf,
    priceListSelected: store.priceList.listSelected,
    usePriceListAsDefault: store.priceList.useAsDefault,
    IVARates: store.generalItem.IVARates,
    IVACodes: store.generalItem.IVACodes,
    IVAFactors: store.generalItem.IVAFactors
  }
})
export default class GenerlItem extends React.Component {

  componentWillMount() {
    const IVARatesKwargs = {
      url: `/api/administration/?group=IVA_RATES`,
      successType: 'FETCH_IVA_RATES_FULFILLED',
      errorType: 'FETCH_IVA_RATES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(IVARatesKwargs))

    const IVACodesKwargs = {
      url: `/api/administration/?group=IVA_CODES`,
      successType: 'FETCH_IVA_CODES_FULFILLED',
      errorType: 'FETCH_IVA_CODES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(IVACodesKwargs))

    const IVAFactorsKwargs = {
      url: `/api/administration/?group=IVA_FACTORS`,
      successType: 'FETCH_IVA_FACTORS_FULFILLED',
      errorType: 'FETCH_IVA_FACTORS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(IVAFactorsKwargs))
  }

  hidePanel() {
    this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})
    this.props.dispatch({type: 'CLEAR_GENERAL_ITEM_PRODUCT', payload: 0})
    this.props.dispatch({type: 'HIDE_GENERAL_ITEM_PANEL', payload: -1})
    document.getElementById('productCodeInputField').focus()
  }

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value

    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? Math.abs(parseFloat(target.value))
          : 0
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const product = {
      ...this.props.product
    }
    product[name] = value

    // if (name == 'sell_price') {

    // }

    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  handleRateChange(event) {
    let rateValue = 0
    const value = event.target.value
    const rateIndex = this.props.IVARates.findIndex(element => {
      return element.code == value
    })
    if (rateIndex != -1) {
      rateValue = this.props.IVARates[rateIndex].value
    } else {
      alert('NOT RATE FOUND')
    }

    const product = {
      ...this.props.product
    }
    product['tax_code_IVA'] = '01'
    product['rate_code_IVA'] = value
    product['taxes_IVA'] = rateValue
    product['is_used'] = false
    product['price'] = product.price
    product['sell_price'] = product.price * (1 + (parseFloat(product.taxes_IVA) / 100))

    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  handleIsUsedChange(event) {

    const isUsed = event.target.checked
    const product = {
      ...this.props.product
    }

    const sortedFactors = this.props.IVAFactors.sort((a, b) => {
      if (parseFloat(a.value) < parseFloat(b.value)) { return 1 }
      if (parseFloat(a.value) > parseFloat(b.value)) { return -1 }
      return 0
    })

    product['is_used'] = isUsed
    if (isUsed) {
      product['tax_code_IVA'] = '08'
      product['factor_IVA'] = (parseFloat(sortedFactors[0].value).toFixed(5))
      product['rate_code_IVA'] = '08'
      product['taxes_IVA'] = ((parseFloat(sortedFactors[0].value) - 1) * 100).toFixed(2)
    } else {
      product['tax_code_IVA'] = '01'
      product['factor_IVA'] = 1
      product['rate_code_IVA'] = '08'
      product['taxes_IVA'] = 13
    }
    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  handleFactorChange(event) {
    const value = event.target.value
    const product = {
      ...this.props.product
    }

    product['factor_IVA'] = (parseFloat(value).toFixed(5))
    product['taxes_IVA'] = ((parseFloat(value) - 1) * 100).toFixed(2)
    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  addToCart() {
    const product = this.props.product
    const generalItemDefaultData = {
      default_discount: '0',
      id: product.id,
      max_discount: '0',
      product: product,
      table_price: '0',
      target_price_list: 'price1',
      current_discount: 0,
      promo_string: '',
      money_discount: 0,
      force_pricing: -1

    }
    this.props.dispatch(productSelected(generalItemDefaultData, this.props.qty, this.props.itemsInCart,
      this.props.client, this.props.warehouse_id, false, this.props.priceListSelected,
      this.props.usePriceListAsDefault, this.props.config.overrideXMLversion))
    // this.props.dispatch(productSelected(product.code, this.props.qty, product, this.props.itemsInCart,
    //   this.props.globalDiscount, this.props.client, this.props.warehouse_id, false))
    this.props.dispatch({type: 'CLEAR_PRODUCT_FIELD_VALUE', payload: 0})
    this.props.dispatch({type: 'CLEAR_GENERAL_ITEM_PRODUCT', payload: 0})
    this.props.dispatch({type: 'HIDE_GENERAL_ITEM_PANEL', payload: -1})
    document.getElementById('productCodeInputField').focus()
  }

  updateQty(ev) {
    const value = Math.abs(ev.target.value)
    this.props.dispatch({type: 'SET_GENERAL_ITEM_QTY', payload: value})
  }

  updatePrice(ev) {
    const name = ev.target.name
    const value = Math.abs(ev.target.value)
    // console.log("Target value general item --> ", value)
    const product = {
      ...this.props.product
    }
    if (name == 'sell_price') {
      product.sell_price = value
      if (this.props.config.overrideXMLversion === '4.3') {
        product.price = (value / (1 + (parseFloat(product.taxes_IVA) / 100))).toFixed(2)
      } else {
        if (product.use_taxes) {
          product.price = value / (1 + (product.taxes / 100))
          // console.log("Product Price --> ", product.price)
        } else {
          product.price = value
        }
      }
    }

    if (name == 'price') {
      product.price = value
      if (this.props.config.overrideXMLversion === '4.3') {
        product.sell_price = (value * (1 + (parseFloat(product.taxes_IVA) / 100))).toFixed(2)
      } else {
        if (product.use_taxes) {
          product.sell_price = value * (1 + (product.taxes / 100))
          // console.log("Product Price --> ", product.price)
        } else {
          product.sell_price = value
        }
      }
    }

    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  updateUseTaxes(ev) {
    const value = ev.target.checked
    const product = {
      ...this.props.product
    }
    product.use_taxes = value
    if (product.use_taxes) {
      product.price = product.sell_price / (1 + (product.taxes / 100))
    } else {
      product.price = product.sell_price
    }
    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  updateTaxesAmount(ev) {
    const value = ev.target.value
    const product = {
      ...this.props.product
    }
    product.taxes = value
    if (product.use_taxes) {
      product.price = product.sell_price / (1 + (product.taxes / 100))
    } else {
      product.price = product.sell_price
    }
    this.props.dispatch({type: 'SET_GENERAL_ITEM_PRODUCT', payload: product})
  }

  generateIVADiv(IVACodesList, IVARatesList, IVAFactorSelector) {

    const usedRow = this.props.config.sellUsedProducts
      ? <div className='general-item-row'>
        <div className='form-group row-50 first'>
          <label>Es usado?</label>
          <input checked={this.props.product.is_used} name='is_used'
            onChange={this.handleIsUsedChange.bind(this)}
            type='checkbox' className='form-control' />
        </div>
        <div className='form-group row-50 last'>
          {IVAFactorSelector}
        </div>
      </div>
      : <div />

    return <div>
      <h3>IVA</h3>
      <div className='general-item-row'>
        <div className='form-group row-50 first'>
          <label>Código de Impuesto</label>
          <Select2
            name='tax_code_IVA'
            value={this.props.product.tax_code_IVA}
            data={IVACodesList}
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            options={{
              placeholder: 'Elija un Código...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>
        <div className='form-group row-50 last'>
          <label>Código de Tarifa</label>
          <Select2
            name='rate_code_IVA'
            value={this.props.product.rate_code_IVA}
            data={IVARatesList}
            className='form-control'
            onSelect={this.handleRateChange.bind(this)}
            options={{
              placeholder: 'Elija una Tarifa...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>
      </div>
      {usedRow}
      <div className='general-item-row'>
        <div className='form-group row-50 first'>
          <label>Tarifa a aplicar %</label>
          <input disabled value={this.props.product.taxes_IVA} name='taxes_IVA' type='text'
            className='form-control' onFocus={this.fieldFocus.bind(this)} />
        </div>
      </div>
    </div>
  }

  generateOLDIVDiv() {
    return <div>
      <h3>Impuestos</h3>
      <div className='general-item-row'>
        <div className='form-group row-20 first'>
          <label>Usa Impuestos?</label>
          <input checked={this.props.product.use_taxes} name='use_taxes'
            onChange={this.updateUseTaxes.bind(this)}
            type='checkbox' className='form-control' />
        </div>
        <div className='form-group row-80 last'>
          <label>Impuestos %</label>
          <input value={this.props.product.taxes} name='taxes' onChange={this.updateTaxesAmount.bind(this)} type='number'
            className='form-control' onFocus={this.fieldFocus.bind(this)} />
        </div>
      </div>
    </div>
  }

  // Render the product
  render() {

    const isVisible = (this.props.isVisible)
      ? 'general-item is-visible'
      : 'general-item'
    const observations = this.props.config.printProductObservationsInFullInvoice
      ? <div className='form-group'>
        <label>Observaciones</label>
        <input value={this.props.product.observations} name='observations' onChange={this.handleInputChange.bind(this)} type='text'
          className='form-control' onFocus={this.fieldFocus.bind(this)} />
      </div>
      : <div />

    const sortedRates = this.props.IVARates.sort((a, b) => {
      if (parseFloat(a.code) > parseFloat(b.code)) { return 1 }
      if (parseFloat(a.code) < parseFloat(b.code)) { return -1 }
      return 0
    })
    const IVARatesList = sortedRates.map(rate => {
      return {text: `${rate.code} - ${rate.name}`, id: `${rate.code}`}
    })

    const sortedCodes = this.props.IVACodes.sort((a, b) => {
      if (parseFloat(a.code) > parseFloat(b.code)) { return 1 }
      if (parseFloat(a.code) < parseFloat(b.code)) { return -1 }
      return 0
    })
    const IVACodesList = sortedCodes.map(rate => {
      return {text: `${rate.code} - ${rate.name}`, id: `${rate.code}`}
    })

    const sortedFactors = this.props.IVAFactors.sort((a, b) => {
      if (parseFloat(a.value) < parseFloat(b.value)) { return 1 }
      if (parseFloat(a.value) > parseFloat(b.value)) { return -1 }
      return 0
    })
    const IVAFactorsList = sortedFactors.map(factor => {
      return {text: `${factor.name} - ${factor.value}`, id: `${factor.value}`}
    })

    const IVAFactorSelector = this.props.product.is_used
      ? <div>
        <label>Factor IVA</label>
        <Select2
          name='factor_IVA'
          value={this.props.product.factor_IVA}
          data={IVAFactorsList}
          className='form-control'
          onSelect={this.handleFactorChange.bind(this)}
          options={{
            placeholder: 'Elija un Factor...',
            noResultsText: 'Sin elementos'
          }}
        />
        {/* <input value={this.props.product.factor_IVA} name='factor_IVA' onChange={this.handleInputChange.bind(this)}
          type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} /> */}
      </div>
      : <div />
    const taxesToShow = this.props.config.overrideXMLversion == '4.3'
      ? this.generateIVADiv(IVACodesList, IVARatesList, IVAFactorSelector)
      : this.generateOLDIVDiv()

    return <div className={isVisible}>
      <div className='general-item-container'>
        <div className='general-item-container-header'>
          Añadir Artículo General
          <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
        </div>
        <div className='general-item-container-content'>

          <div className='general-item-container-content-left'>
            <h3>Datos del Artículo</h3>
            <div className='form-group'>
              <label>Descripción</label>
              <input value={this.props.product.description} name='description' onChange={this.handleInputChange.bind(this)} type='text'
                className='form-control' onFocus={this.fieldFocus.bind(this)} />
            </div>

            {observations}

            <div className='form-group'>
              <label>Es servicio?</label>
              <input checked={this.props.product.is_service} name='is_service'
                onChange={this.handleInputChange.bind(this)}
                type='checkbox' className='form-control' />
            </div>

            <h3>Precio</h3>
            <div className='general-item-row'>
              <div className='form-group row-20 first'>
                <label>Cantidad</label>
                <input value={this.props.qty} name='qty'
                  onChange={this.updateQty.bind(this)}
                  type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />
              </div>
              <div className='form-group row-40 middle'>
                <label>Precio unit Sin IVA</label>
                <input value={this.props.product.price} name='price' onChange={this.updatePrice.bind(this)}
                  type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />
              </div>
              <div className='form-group row-40 last'>
                <label>Precio unit Con IVA</label>
                <input value={this.props.product.sell_price} name='sell_price' onChange={this.updatePrice.bind(this)}
                  type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />
              </div>
            </div>
          </div>

          <div className='general-item-container-content-right'>
            {taxesToShow}

            {/* <div className='form-group'>
              <label>Cantidad</label>
              <input value={this.props.qty} name='qty'
                onChange={this.updateQty.bind(this)}
                type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />
            </div>

            <div className='form-group'>
              <label>Precio IVI</label>
              <input value={this.props.product.sell_price} name='sell_price' onChange={this.updatePrice.bind(this)}
                type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />
            </div> */}

            <button className='general-item-button' onClick={this.addToCart.bind(this)} >Agregar</button>

          </div>
        </div>
      </div>
    </div>

  }

}
