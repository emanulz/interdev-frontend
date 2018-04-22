import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    product: store.products.productActive,
    products: store.products.products
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

  render() {

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Inventarios y Observaciones</span>
        <hr />

        <div className='form-group row input-block'>

          <div className='col-xs-6 second'>
            <label>Usa Inventario?</label>
            <input checked={this.props.product.inventory_enabled} name='inventory_enabled'
              onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />
          </div>

          <div className='col-xs-6 second'>
            <label>Puede Facturar en Negativo?</label>
            <input checked={this.props.product.inventory_negative} name='inventory_negative'
              onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />
          </div>

        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>
            <label>Mínimo Inventario</label>
            <input value={this.props.product.inventory_minimum} name='inventory_minimum'
              onChange={this.handleInputChange.bind(this)}
              type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />
          </div>

          <div className='col-xs-6 first'>
            <label>Máximo Inventario</label>
            <input value={this.props.product.inventory_maximum} name='inventory_maximum'
              onChange={this.handleInputChange.bind(this)}
              type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />
          </div>
        </div>

        <div className='form-group'>
          <label>Observaciones</label>
          <textarea value={this.props.product.observations} name='observations'
            style={{resize: 'none'}}
            rows='4'
            onChange={this.handleInputChange.bind(this)}
            className='form-control' />
        </div>

      </div>

      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Extras</span>
        <hr />

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form3)
