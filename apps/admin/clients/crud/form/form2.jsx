import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    client: store.clients.clientActive,
    clients: store.clients.clients
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

  render() {

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-4 fields-container first'>
        <span>Tabla de Precios</span>
        <hr />

      </div>
    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
