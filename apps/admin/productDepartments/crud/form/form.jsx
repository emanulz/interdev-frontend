import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem } from '../../../../../utils/api'

@connect((store) => {
  return {
    productDepartment: store.productDepartments.productDepartmentActive,
    productDepartments: store.productDepartments.productDepartments
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_PRODUCT_DEPARTMENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_PRODUCT_DEPARTMENT', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'code',
        url: '/api/productdepartments/',
        lookUpValue: lookUp,
        dispatchType: 'SET_PRODUCT_DEPARTMENT',
        dispatchType2: 'SET_PRODUCT_DEPARTMENT_OLD',
        dispatchErrorType: 'PRODUCT_DEPARTMENT_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Familia de Producto',
        redirectUrl: '/admin/productdepartments',
        history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItem(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.productDepartment.id == '0000000000') {

        const kwargs = {
          lookUpField: 'code',
          url: '/api/productdepartments/',
          lookUpValue: lookUp,
          dispatchType: 'SET_PRODUCT_DEPARTMENT',
          dispatchType2: 'SET_PRODUCT_DEPARTMENT_OLD',
          dispatchErrorType: 'PRODUCT_DEPARTMENT_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Familia de Producto',
          redirectUrl: '/admin/productdepartments',
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

    const productDepartment = {
      ...this.props.productDepartment
    }

    productDepartment[name] = value

    this.props.dispatch({type: 'SET_PRODUCT_DEPARTMENT', payload: productDepartment})
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
          <input value={this.props.productDepartment.code} name='code' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.productDepartment.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Identificador</label>
          <input value={this.props.productDepartment.identifier} name='identifier' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Observaciones</label>
          <textarea value={this.props.productDepartment.observations} name='observations'
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
