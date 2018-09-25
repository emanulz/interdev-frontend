import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem } from '../../../../../utils/api'

@connect((store) => {
  return {
    clientCategory: store.clientCategories.clientCategoryActive,
    clientCategories: store.clientCategories.clientCategories
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_CLIENT_CATEGORY', payload: ''})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_CLIENT_CATEGORY', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'code',
        url: '/api/clientcategories/',
        lookUpValue: lookUp,
        dispatchType: 'SET_CLIENT_CATEGORY',
        dispatchType2: 'SET_CLIENT_CATEGORY_OLD',
        dispatchErrorType: 'CLIENT_CATEGORY_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Familia de Producto',
        redirectUrl: '/admin/clientcategories',
        history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItem(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.clientCategory.id == '0000000000') {

        const kwargs = {
          lookUpField: 'code',
          url: '/api/clientcategories/',
          lookUpValue: lookUp,
          dispatchType: 'SET_CLIENT_CATEGORY',
          dispatchType2: 'SET_CLIENT_CATEGORY_OLD',
          dispatchErrorType: 'CLIENT_CATEGORY_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Categoría de cliente',
          redirectUrl: '/admin/clientcategories',
          history: this.props.history
        }
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch(setItem(kwargs))

      }
    }
  }

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value
    console.log(target.value)
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
    console.log(target.name)

    const clientCategory = {
      ...this.props.clientCategory
    }

    clientCategory[name] = value

    this.props.dispatch({type: 'SET_CLIENT_CATEGORY', payload: clientCategory})
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

        <span>Datos generales</span>
        <hr />

        <div className='form-group'>
          <label>Código</label>
          <input value={this.props.clientCategory.code} name='code' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.clientCategory.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Descuento Máximo %</label>
          <input value={this.props.clientCategory.max_discount} name='max_discount' onChange={this.handleInputChange.bind(this)} type='number'
            className='form-control' />
        </div>
        <div className='form-group'>
          <label>Descuento Predeterminado %</label>
          <input value={this.props.clientCategory.pred_discount} name='pred_discount' onChange={this.handleInputChange.bind(this)} type='number'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Lista de Precios</label>
          <select onChange={this.handleInputChange.bind(this)} className='form-control' name='pred_price_list'
            value={this.props.clientCategory.pred_price_list} >
            <option value='1'>Precio 1</option>
            <option value='2'>Precio 2</option>
            <option value='3'>Precio 3</option>
          </select>
        </div>

        <div className='form-group'>
          <label>Observaciones</label>
          <textarea value={this.props.clientCategory.observations} name='observations'
            style={{resize: 'none'}}
            rows='4'
            onChange={this.handleInputChange.bind(this)}
            className='form-control' />
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
