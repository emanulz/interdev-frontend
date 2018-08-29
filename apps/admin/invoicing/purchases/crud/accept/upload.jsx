import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    purchaseToUpload: store.epurchases.purchaseToUpload
  }
})

class Form extends React.Component {
  // REACT METHODS

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
      case 'select-one':
      {
        this.clearAdrresses(target.name)
        value = target.value
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const client = {
      ...this.props.client
    }

    client[name] = value

    this.props.dispatch({type: 'SET_CLIENT', payload: client})
  }

  fieldFocus(ev) {
    ev.target.select()
  }

  handleFileChange(e) {
    e.preventDefault()

    const reader = new FileReader()
    const file = e.target.files[0]

    reader.onloadend = () => {

      this.props.dispatch({type: 'SET_EPURCHASE_FILE', payload: file})
    }

    reader.readAsDataURL(file)
  }

  render() {

    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 fields-container first'>

        <span>SELECCIONAR FACTURA ELECTRÓNICA</span>
        <hr />

        <div className='form-group'>
          <div className='form-group-content'>
            <label>CARGAR FACTURA</label>
            <input name='code' onChange={this.handleFileChange.bind(this)} type='file'
              className='form-control' />
            <button className='btn btn-primary uploadButton'> Cargar </button>
          </div>
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
