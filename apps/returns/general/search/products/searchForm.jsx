import React from 'react'
import {connect} from 'react-redux'

import {searchProductBakend} from './actions'

@connect((store) => {
  return {
    products: store.products.products,
    searchValue: store.searchProducts.searchValue
  }
})
export default class searchForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchVal: ''
    }
  }

  inputKeyPress(ev) {

    if (ev.key == 'Enter') {

      ev.preventDefault()
      this.searchProductAction()

    } else {
      this.props.dispatch({type: 'SET_PRODUCT_SEARCH_FIELD_VALUE', payload: ev.target.value})
    }

  }

  searchProductAction() {
    // this.props.dispatch(searchProduct(this.props.searchValue, this.props.products))
    const kwargs = {
      lookUpField: 'description',
      url: '/api/products/',
      lookUpValue: this.props.searchValue,
      lookUpName: 'descripción',
      modelName: 'Productos'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(searchProductBakend(kwargs))
  }

  render() {

    return <form action='' className='col-sm-12 form-horizontal'>
      <div className='form-group'>
        <div className='col-xs-12'>
          <label htmlFor='product-search-input'>Búsqueda por Descripción:</label>
        </div>
        <div className='col-xs-12 row'>
          <div className='col-xs-7 col-sm-8'>
            <input onKeyDown={this.inputKeyPress.bind(this)} onChange={this.inputKeyPress.bind(this)} value={this.props.searchValue} type='text' style={{
              'width': '100%'
            }} id='product-search-input' className='form-control input-lg mousetrap' />
          </div>
          <div className='col-xs-2'>
            <button onClick={this.searchProductAction.bind(this)} type='button' id='product-search-btn' style={{
              'height': '48px',
              'width': '48px'
            }} className='btn btn-success form-control marginBtnAdd2'>
              <span className='fa fa-search' />
            </button>
          </div>
        </div>
      </div>
    </form>

  }

}
