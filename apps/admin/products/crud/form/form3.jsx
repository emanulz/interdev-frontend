import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getItemDispatch } from '../../../../../utils/api'
import {determinAmounts} from '../../actions.js'
import Select2 from 'react-select2-wrapper'

@connect((store) => {
  return {
    product: store.productsAdmin.productActive,
    products: store.productsAdmin.products,
    file: store.productsAdmin.file,
    config: store.config.globalConf
  }
})

class Form3 extends React.Component {

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value
    // const value = target.type === 'checkbox' ? target.checked : target.value
    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : 0
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    let product = {
      ...this.props.product
    }

    product[name] = value
    product = determinAmounts(product, name, value, this.props.config.overrideXMLversion)
    this.props.dispatch({type: 'SET_PRODUCT', payload: product})
  }

  // handleRateChange(event) {
  //   let rateValue = 0
  //   const value = event.target.value
  //   const name = event.target.name
  //   const rateIndex = this.props.IVARates.findIndex(element => {
  //     return element.code == value
  //   })
  //   if (rateIndex != -1) {
  //     rateValue = this.props.IVARates[rateIndex].value
  //   } else {
  //     alert('NOT RATE FOUND')
  //   }

  //   let product = {
  //     ...this.props.product
  //   }
  //   product['tax_code_IVA'] = '01'
  //   product['rate_code_IVA'] = value
  //   product['taxes_IVA'] = rateValue
  //   product['is_used'] = false

  //   product = determinAmounts(product, name, value, this.props.config.overrideXMLversion)
  //   this.props.dispatch({type: 'SET_PRODUCT', payload: product})
  // }

  // handleIsUsedChange(event) {

  //   const isUsed = event.target.checked
  //   const name = event.target.name
  //   let product = {
  //     ...this.props.product
  //   }

  //   const sortedFactors = this.props.IVAFactors.sort((a, b) => {
  //     if (parseFloat(a.value) < parseFloat(b.value)) { return 1 }
  //     if (parseFloat(a.value) > parseFloat(b.value)) { return -1 }
  //     return 0
  //   })

  //   product['is_used'] = isUsed
  //   if (isUsed) {
  //     product['tax_code_IVA'] = '08'
  //     product['factor_IVA'] = (parseFloat(sortedFactors[0].value).toFixed(5))
  //     product['rate_code_IVA'] = '08'
  //     product['taxes_IVA'] = ((parseFloat(sortedFactors[0].value) - 1) * 100).toFixed(2)
  //   } else {
  //     product['tax_code_IVA'] = '01'
  //     product['factor_IVA'] = 1
  //     product['rate_code_IVA'] = '08'
  //     product['taxes_IVA'] = 13
  //   }
  //   product = determinAmounts(product, name, isUsed, this.props.config.overrideXMLversion)
  //   this.props.dispatch({type: 'SET_PRODUCT', payload: product})
  // }

  // handleFactorChange(event) {
  //   const value = event.target.value
  //   const name = event.target.name
  //   let product = {
  //     ...this.props.product
  //   }

  //   product['factor_IVA'] = (parseFloat(value).toFixed(5))
  //   product['taxes_IVA'] = ((parseFloat(value) - 1) * 100).toFixed(2)
  //   product = determinAmounts(product, name, value, this.props.config.overrideXMLversion)
  //   this.props.dispatch({type: 'SET_PRODUCT', payload: product})
  // }

  fieldFocus(ev) {
    ev.target.select()
  }

  onImageChange(e) {
    this.props.dispatch({type: 'SET_IMAGE_FILE', payload: e.target.files[0]})
  }

  render() {

    // const taxesData = this.props.taxes.map(tax => {
    //   return {text: `${tax.code} - ${tax.name}`, id: `${tax.code}`}
    // })

    // const sortedRates = this.props.IVARates.sort((a, b) => {
    //   if (parseFloat(a.code) > parseFloat(b.code)) { return 1 }
    //   if (parseFloat(a.code) < parseFloat(b.code)) { return -1 }
    //   return 0
    // })
    // const IVARatesList = sortedRates.map(rate => {
    //   return {text: `${rate.code} - ${rate.name}`, id: `${rate.code}`}
    // })

    // const sortedCodes = this.props.IVACodes.sort((a, b) => {
    //   if (parseFloat(a.code) > parseFloat(b.code)) { return 1 }
    //   if (parseFloat(a.code) < parseFloat(b.code)) { return -1 }
    //   return 0
    // })
    // const IVACodesList = sortedCodes.map(rate => {
    //   return {text: `${rate.code} - ${rate.name}`, id: `${rate.code}`}
    // })

    // const sortedFactors = this.props.IVAFactors.sort((a, b) => {
    //   if (parseFloat(a.value) < parseFloat(b.value)) { return 1 }
    //   if (parseFloat(a.value) > parseFloat(b.value)) { return -1 }
    //   return 0
    // })
    // const IVAFactorsList = sortedFactors.map(factor => {
    //   return {text: `${factor.name} - ${factor.value}`, id: `${factor.value}`}
    // })

    // const IVAFactorSelector = this.props.product.is_used
    //   ? <div className='col-xs-6 second'>
    //     <label>Factor IVA</label>
    //     <Select2
    //       name='factor_IVA'
    //       value={this.props.product.factor_IVA}
    //       data={IVAFactorsList}
    //       className='form-control'
    //       onSelect={this.handleFactorChange.bind(this)}
    //       options={{
    //         placeholder: 'Elija un Factor...',
    //         noResultsText: 'Sin elementos'
    //       }}
    //     />
    //     {/* <input value={this.props.product.factor_IVA} name='factor_IVA' onChange={this.handleInputChange.bind(this)}
    //       type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} /> */}
    //   </div>
    //   : <div />

    // IVARatesList = IVARatesList.sort

    // const usedRow = this.props.config.sellUsedProducts
    //   ? <div className='form-group row input-block'>
    //     <div className='col-xs-6 first'>
    //       <label>Es Usado?</label>
    //       <input checked={this.props.product.is_used} name='is_used'
    //         onChange={this.handleIsUsedChange.bind(this)}
    //         type='checkbox' className='form-control' />
    //     </div>
    //     {IVAFactorSelector}
    //   </div>
    //   : <div />

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      {/* <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>IVA</span>
        <hr />
        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Código Impuesto</label>

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

          <div className='col-xs-4 first'>

            <label>Código Tarifa</label>

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

          <div className='col-xs-2'>
            <label>Valor IVA</label>
            <input disabled value={this.props.product.taxes_IVA} name='taxes_IVA' onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' onFocus={this.fieldFocus.bind(this)} />
          </div>

        </div>

        {usedRow}

      </div> */}

      <div className='col-xs-12 col-sm-6 fields-container first'>
        <span>Extras</span>
        <hr />
        <div className='form-group'>
          <label>Observaciones</label>
          <textarea value={this.props.product.observations} name='observations'
            style={{resize: 'none'}}
            rows='4'
            onChange={this.handleInputChange.bind(this)}
            className='form-control' />
        </div>
        <div className='form-group'>
          <label>Imágen Producto</label>
          <input type='file' name='image_picker' onChange={this.onImageChange.bind(this)} accept='image/png, image/jpeg'capture='camera' />
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form3)
