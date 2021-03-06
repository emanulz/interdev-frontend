import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem, getItemDispatch } from '../../../../../utils/api'
import Select2 from 'react-select2-wrapper'
import SearchCabysPanel from './searchCabysPanel.jsx'

import { generalSave } from '../../../../../utils/api'

@connect((store) => {
  return {
    product: store.productsAdmin.productActive,
    productFetching: store.productsAdmin.productFetching,
    products: store.productsAdmin.products,
    productDepartments: store.productDepartments.productDepartments,
    productSubDepartments: store.productSubDepartments.productSubDepartments,
    conf: store.config.globalConf
  }
})

class Form extends React.Component {

  cabysSearchKey = '';
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_PRODUCT'})
    this.props.dispatch({type: 'CLEAR_IMAGE_FILE'})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_PRODUCT'})

    // Fetch the elements of the Departments model and dispatch to reducer
    // *******************************************************************
    const productDepartmentKwargs = {
      url: '/api/productdepartments/?limit=300',
      successType: 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_DEPARTMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED'})
    this.props.dispatch(getItemDispatch(productDepartmentKwargs))
    // *******************************************************************

    // Fetch the elements of the Subdepartments model and dispatch to reducer
    // *******************************************************************
    const productSubDepartmentKwargs = {
      url: '/api/productsubdepartments/?limit=300',
      successType: 'FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productSubDepartmentKwargs))

    if (this.props.conf.useInventoryAsDefault) {
      this.props.dispatch({type: 'SET_PRODUCT_USE_INVENTORY_AS_DEFAULT', payload: ''})
    }
    // *******************************************************************

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'code',
        url: '/api/productslist/',
        lookUpValue: lookUp,
        dispatchType: 'SET_PRODUCT',
        dispatchType2: 'SET_PRODUCT_OLD',
        dispatchErrorType: 'PRODUCT_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Producto',
        redirectUrl: '/admin/products',
        history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED'})
      this.props.dispatch(setItem(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.product.id == '0000000000' && !nextProps.productFetching) {
        // console.log('PRODUCT FETCHING', nextProps.productFetching)
        const kwargs = {
          lookUpField: 'code',
          url: '/api/productslist/',
          lookUpValue: lookUp,
          dispatchType: 'SET_PRODUCT',
          dispatchType2: 'SET_PRODUCT_OLD',
          dispatchErrorType: 'PRODUCT_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Producto',
          redirectUrl: '/admin/products',
          history: this.props.history
        }
        this.props.dispatch({type: 'SET_PRODUCT_FETCHING', payload: ''})
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch(setItem(kwargs))

      }
    }

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

  handleCabysChange(event){
    this.cabysSearchKey = event.target.value

  }


  verifyCabysCode(){
    console.log("Cabys code --> ", this.props.product.cabys.catCode)
    const kwargs = {
      method: 'get',
      url: `/api/products/cabysValidate/?code=${this.cabysSearchKey}`,
      sucessMessage: `Código verificado correctamente.`,
      errorMessage: `Hubo un error al verificar el código.`,
      successType: 'CABYS_VERIFY_RESULT',
      errorType: 'FETCHING_DONE'

    }

    this.props.dispatch(generalSave(kwargs))
  }

  displayCabysSearch(){

    this.props.dispatch({type: 'TOGGLE_CABYS_SEARCH_PANEL'})
  }

  render() {

    // ********************************************************************
    // SELECT2 DATA
    // ********************************************************************
    const departments = this.props.productDepartments
    const subDepartments = this.props.productSubDepartments

    departments.sort((a, b) => {
      return a.code - b.code
    })

    const departmentData = departments.map(department => {
      return {text: `${department.identifier} - ${department.name}`, id: `${department.id}`}
    })

    const subDepartmentData = subDepartments.map(subdepartment => {
      return {text: `${subdepartment.identifier} - ${subdepartment.name}`, id: subdepartment.id}
    })

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************

    let active_cabys = <div>
    <div>Código Cabys activo:</div>
      <div>Sin definir</div>
    </div>
    if(this.props.product.cabys.id){
      const cod_desc = `${this.props.product.cabys.catCode} - ${this.props.product.cabys.description}`
      active_cabys = <div>
        <div>Código Cabys activo:</div>
        <div>{cod_desc}</div>
      </div>
    }

    let cabysSearchPanel = ''
    if(this.props.conf.usesCabysSearcher){
      cabysSearchPanel = <button 
        className="btn btn-info"
        onClick={this.displayCabysSearch.bind(this)}>Búscar</button>
    }
    return <div className='col-xs-12 row form-container'>
      <SearchCabysPanel filterA={null} filterB={null} filterC={null} rate={null} />
      <div className='col-xs-12 col-sm-6 fields-container first'>

        <span>Códigos y Descripción</span>
        <hr />

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Código</label>
            <input value={this.props.product.code} name='code' onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' />

          </div>

          <div className='col-xs-6 second'>

            <label>Descripción Corta</label>
            <input value={this.props.product.short_description} name='short_description' onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' />

          </div>
        </div>

        <div className='form-group'>
          <label>Descripción</label>
          <input value={this.props.product.description} name='description' onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Código de barras</label>
            <input value={this.props.product.barcode} name='barcode' onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' />

          </div>

          <div className='col-xs-6 second'>

            <label>Código de barras 2</label>
            <input value={this.props.product.internal_barcode} name='internal_barcode' onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' />

          </div>
        </div>

        <div className='form-group row input-block'>

          <div className='col-xs-6 first'>
            <label>Fraccionado</label>
            <input checked={this.props.product.fractioned} name='fractioned'
              onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />
          </div>

          <div className='col-xs-6 second'>
            <label>Unidad</label>
            <input value={this.props.product.unit} name='unit' onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' />
          </div>
        </div>

        <div className='form-group row input-block'>

          <div className='col-xs-6 first'>
            <label>En consignación</label>
            <input checked={this.props.product.consignment} name='consignment'
              onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />
          </div>

          <div className='col-xs-6 second'>
            <label>Pregunta Precio</label>
            <input checked={this.props.product.ask_price} name='ask_price'
              onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />
          </div>
        </div>

      </div>

      <div className='col-xs-12 col-sm-6 fields-container second'>

        <span>Familias y Datos</span>
        <hr />

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Familia</label>

            <Select2
              name='department'
              value={this.props.product.department}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              data={departmentData}
              options={{
                placeholder: 'Elija una Familia...',
                noResultsText: 'Sin elementos'
              }}
            />

          </div>

          <div className='col-xs-6 second'>

            <label>Sub Familia</label>

            <Select2
              name='subdepartment'
              value={this.props.product.subdepartment}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              data={subDepartmentData}
              options={{
                placeholder: 'Elija una Familia...',
                noResultsText: 'Sin elementos'
              }}
            />

          </div>
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Código del proveedor</label>
            <input value={this.props.product.supplier_code} name='supplier_code'
              onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' />

          </div>

          <div className='col-xs-6 second'>

            <label>Modelo</label>
            <input value={this.props.product.model} name='model' onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' />

          </div>
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Número de parte</label>
            <input value={this.props.product.part_number} name='part_number'
              onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' />

          </div>

          <div className='col-xs-6 second'>

            <label>Código de marca</label>
            <input value={this.props.product.brand_code} name='brand_code' onChange={this.handleInputChange.bind(this)}
              type='text' className='form-control' />

          </div>
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>
            <label>Activo?</label>
            <input checked={this.props.product.is_active} name='is_active'
              onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />
          </div>
          <div className='col-xs-6 second'>
            <label>Es Servicio?</label>
            <input checked={this.props.product.is_service} name='is_service'
              onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />
          </div>
          <div className="col-xs-6">
              <label>Código Cabys</label>
              <input name='cabys_catcode' onChange={this.handleCabysChange.bind(this)}
              type='text' className='form-control' />
          </div>
          <div className="col-xs-6">
              <button 
              className="btn btn-info"
              onClick={this.verifyCabysCode.bind(this)}>Verificar</button>
              {cabysSearchPanel}
              {active_cabys}
          </div>
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
