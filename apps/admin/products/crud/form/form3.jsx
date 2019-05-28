import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import Select2 from 'react-select2-wrapper'

@connect((store) => {
  return {
    product: store.products.productActive,
    products: store.products.products,
    file: store.products.file,
    taxes: store.products.taxes
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

    const product = {
      ...this.props.product
    }

    product[name] = value

    this.props.dispatch({type: 'SET_PRODUCT', payload: product})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  onImageChange(e) {
    this.props.dispatch({type: 'SET_IMAGE_FILE', payload: e.target.files[0]})
  }

  render() {

    const taxesData = this.props.taxes.map(tax => {
      return {text: `${tax.code} - ${tax.name}`, id: `${tax.code}`}
    })

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-6 fields-container first'>
        <span>Impuestos</span>
        <hr />

        <div className='form-group row input-block'>

          <div className='col-xs-6 first'>

            <label>Impuesto 1</label>

            <Select2
              name='tax_code'
              value={this.props.product.tax_code}
              data={taxesData}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              options={{
                placeholder: 'Elija un Impuesto...',
                noResultsText: 'Sin elementos'
              }}
            />
          </div>

          <div className='col-xs-4'>
            <label>Valor 1 %</label>
            <input value={this.props.product.taxes} name='taxes' onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' onFocus={this.fieldFocus.bind(this)} />
          </div>

          <div className='col-xs-2 second'>
            <label>Activo?</label>
            <input checked={this.props.product.use_taxes} name='use_taxes'
              onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />
          </div>
        </div>

        <span>IVA (NUEVO)</span>
        <hr />
        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Código Impuesto</label>

            <Select2
              name='tax_code_IVA'
              value={this.props.product.tax_code_IVA}
              data={taxesData}
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
              data={taxesData}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              options={{
                placeholder: 'Elija una Tarifa...',
                noResultsText: 'Sin elementos'
              }}
            />
          </div>

          <div className='col-xs-2'>
            <label>Valor IVA</label>
            <input value={this.props.product.taxes_IVA} name='taxes_IVA' onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' onFocus={this.fieldFocus.bind(this)} />
          </div>

        </div>
        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>
            <label>Factor IVA</label>
            <input value={this.props.product.factor_IVA} name='factor_IVA' onChange={this.handleInputChange.bind(this)}
              type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />
          </div>
          <div className='col-xs-2'>
            <label>Es Usado?</label>
            <input checked={this.props.product.is_used} name='is_used'
              onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />
          </div>
        </div>
      </div>

      <div className='col-xs-12 col-sm-6 fields-container second'>
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
