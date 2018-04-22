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
    permissions: store.productSubDepartments.permissions,
    productSubDepartment: store.productSubDepartments.productSubDepartmentActive,
    nextProductSubDepartment: store.productSubDepartments.nextProductSubDepartment,
    previousProductSubDepartment: store.productSubDepartments.previousProductSubDepartment,
    productSubDepartments: store.productSubDepartments.productSubDepartments
  }
})
export default class Update extends React.Component {

  componentDidMount() {
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_PRODUCT_SUBDEPARTMENT', payload: ''})
  }

  componentWillUpdate(nextProps) {

    const code = this.props.location.pathname.split('/').pop()

    if (nextProps.nextProductSubDepartment == 0 && nextProps.previousProductSubDepartment == 0 && nextProps.productSubDepartments.length) {

      const kwargs = {
        items: [
          ...nextProps.productSubDepartments
        ],
        codeField: 'code',
        code: code,
        dispatchType: 'SET_NEXT_PREV_PRODUCT_SUBDEPARTMENT'
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
        <Link to={`/admin/productsubdepartments/edit/${this.props.previousproductSubDepartment}`}>
          <span className={`previous fa fa-chevron-circle-left`} />
        </Link>
        <Link to={`/admin/productsubdepartments/edit/${this.props.nextproductSubDepartment}`}>
          <span className='next fa fa-chevron-circle-right' />
        </Link>
        <span onClick={this.toggleBar.bind(this)} className='list fa fa-list' />
      </div>

      {content}

      <ItemsBar items={this.props.productSubDepartments} tittle='Lista de Sub Familias' codeField='code' descriptionField='name'
        descriptionField2={false} editPath='/admin/productSubDepartments/edit/' />
    </div>

  }

}
