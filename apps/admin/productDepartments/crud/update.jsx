/*
 * Module dependencies
 */
import React from 'react'
import Form from './form/form.jsx'

import Unauthorized from '../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import {setNextPrevItem} from '../../../utils/api'
import {Link} from 'react-router-dom'
import UpdateButtons from './form/updateButtons.jsx'
import ItemsBar from '../../layout/itemsBar/itemsBar.jsx'
import {toggleItemsBar} from '../../layout/itemsBar/actions'

@connect((store) => {
  return {
    permissions: store.productDepartments.permissions,
    productDepartment: store.productDepartments.productDepartmentActive,
    nextProductDepartment: store.productDepartments.nextProductDepartment,
    previousProductDepartment: store.productDepartments.PreviousproductDepartment,
    productDepartments: store.productDepartments.productDepartments
  }
})
export default class Update extends React.Component {

  componentDidMount() {
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_PRODUCT_DEPARTMENT', payload: ''})
  }

  componentWillUpdate(nextProps) {

    const code = this.props.location.pathname.split('/').pop()

    if (nextProps.nextProductDepartment == 0 && nextProps.previousProductDepartment == 0 && nextProps.productDepartments.length) {

      const kwargs = {
        items: [
          ...nextProps.productDepartments
        ],
        codeField: 'code',
        code: code,
        dispatchType: 'SET_NEXT_PREV_PRODUCT_DEPARTMENT'
      }

      this.props.dispatch(setNextPrevItem(kwargs))

    }
  }

  toggleBar() {
    toggleItemsBar()
  }

  // Main Layout
  render() {

    let content = ''

    const code = this.props.location.pathname.split('/').pop()

    switch (this.props.permissions.change) {
      case true:
      {
        content = <div className='heigh100'>
          <Form key={code} update location={this.props.location} />
          <UpdateButtons />
        </div>
        break
      } // case

      case false:
      {
        content = <Unauthorized />
        break
      } // case
      default:
      {
        content = <div>FETCHING</div>
        break
      } // case
    }

    return <div className='create heigh100'>
      <div className='create-edit-header'>
        <h1>EDITAR FAMILIA DE PRODUCTOS {code}</h1>
        <Link to={`/admin/productdepartments/edit/${this.props.previousProductDepartment}`}>
          <span className={`previous fa fa-chevron-circle-left`} />
        </Link>
        <Link to={`/admin/productdepartments/edit/${this.props.nextProductDepartment}`}>
          <span className='next fa fa-chevron-circle-right' />
        </Link>
        <span onClick={this.toggleBar.bind(this)} className='list fa fa-list' />
      </div>

      {content}

      <ItemsBar items={this.props.productDepartments} tittle='Lista de Familias' codeField='code' descriptionField='name'
        descriptionField2={false} editPath='/admin/productdepartments/edit/' />
    </div>

  }

}
