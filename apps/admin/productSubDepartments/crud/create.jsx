/*
 * Module dependencies
 */
import React from 'react'
import Form from './form/form.jsx'

import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import CreateButtons from './form/createButtons.jsx'
import ItemsBar from '../../layout/itemsBar/itemsBar.jsx'
import {toggleItemsBar} from '../../layout/itemsBar/actions'

@connect((store) => {
  return {
    permissions: store.productSubDepartments.permissions,
    productSubDepartments: store.productSubDepartments.productSubDepartments
  }
})
export default class Update extends React.Component {

  toggleBar() {
    toggleItemsBar()
  }

  // Main Layout
  render() {

    let content = ''

    switch (this.props.permissions.add) {
      case true:
      {
        content = <div className='heigh100'>
          <Form />
          <CreateButtons />
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
        <h1>CREAR SUB FAMILIA DE PRODUCTOS</h1>
        <span onClick={this.toggleBar.bind(this)} className='list fa fa-list' />
      </div>
      {content}

      <ItemsBar items={this.props.productSubDepartments} tittle='Lista de Sub Familias' codeField='consecutive'
        descriptionField='name' descriptionField2={false} editPath='/admin/productsubdepartments/edit/' />
    </div>

  }

}
