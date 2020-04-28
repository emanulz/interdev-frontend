import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import {determinAmounts} from '../../actions.js'

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
    if(name==='mass' || name ==='reseller_commision'){
      product['product_extras'][name] = value
    }else{
      product[name] = value
      product = determinAmounts(product, name, value, this.props.config.overrideXMLversion)
    }

    this.props.dispatch({type: 'SET_PRODUCT', payload: product})
  }

  

  fieldFocus(ev) {
    ev.target.select()
  }

  onImageChange(e) {
    this.props.dispatch({type: 'SET_IMAGE_FILE', payload: e.target.files[0]})
  }

  render() {

    let extra_field_prods = '';
    if(this.props.update){
    extra_field_prods = <div className='col-xs-4'>
        <label>Comisión dist.</label>
        <input value={this.props.product.product_extras.reseller_commision} name='reseller_commision' onChange={this.handleInputChange.bind(this)}
          type='text' className='form-control' onFocus={this.fieldFocus.bind(this)} />

        <label>Masa (kg)</label>
        <input value={this.props.product.product_extras.mass} name='mass' onChange={this.handleInputChange.bind(this)}
          type='text' className='form-control' onFocus={this.fieldFocus.bind(this)} />
      </div>
    }
    
    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      
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

      <div className='col-xs-12 col-sm-6 fields-container second'>
        <div className="row">

          {extra_field_prods}

        </div>
      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form3)
