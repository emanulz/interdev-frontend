import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    product: store.productsAdmin.productActive,
    products: store.productsAdmin.products
  }
})

class Form3 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {file: '', imagePreviewUrl: ''}
  }

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

  handleImageChange(e) {
    e.preventDefault()

    const reader = new FileReader()
    const file = e.target.files[0]

    reader.onloadend = () => {

      const product = {
        ...this.props.product
      }
      product['image'] = file
      product['imagePreviewUrl'] = reader.result

      this.props.dispatch({type: 'SET_PRODUCT', payload: product})
    }

    reader.readAsDataURL(file)
  }

  render() {

    const imagePreviewUrl = this.props.product.imagePreviewUrl ? this.props.product.imagePreviewUrl : this.props.product.file

    let imagePreview = null

    if (imagePreviewUrl) {
      imagePreview = (<img src={imagePreviewUrl} />)
    } else {
      imagePreview = (<div className='previewText'>Seleccione una imagen para ver la previsualización</div>)
    }

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Imagen</span>
        <hr />

        <div className='form-group'>
          <label>Imagen</label>
          <input name='image' onChange={this.handleImageChange.bind(this)} type='file'
            className='form-control' />
        </div>

        <div className='form-group'>
          <div className='imgPreview'>
            {imagePreview}
          </div>
        </div>

      </div>

      <div className='col-xs-12 col-sm-6 fields-container second'>

        <span>Imagen</span>
        <hr />

        <div className='form-group'>
          <label>Imagen</label>
          <input name='image' onChange={this.handleImageChange.bind(this)} type='file'
            className='form-control' />
        </div>

        <div className='form-group'>
          <div className='imgPreview'>
            {imagePreview}
          </div>
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form3)
