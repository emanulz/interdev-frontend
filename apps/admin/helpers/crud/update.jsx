/*
 * Module dependencies
 */
import React from 'react'
import Form from './form/form.jsx'

import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'

import {Link} from 'react-router-dom'
import UpdateButtons from './form/updateButtons.jsx'

import {toggleItemsBar} from '../../layout/itemsBar/actions'

@connect((store) => {
  return {
    permissions: store.productDepartments.permissions,
    model: store.helpers.model,
  //   productDepartment: store.productDepartments.productDepartmentActive,
  //   productDepartments: store.productDepartments.productDepartments
   }
})
export default class Update extends React.Component {


  componentWillUpdate(nextProps) {

    const code = this.props.location.pathname.split('/').pop()

  }

  toggleBar() {
    toggleItemsBar()
  }

  // Main Layout
  render() {

    let content = ''

    const code = this.props.location.pathname.split('/').pop()

    switch (true) {
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
        content = <div>CARGANDO</div>
        break
      } // case
    }

    return <div className='create heigh100'>
      <div className='create-edit-header'>
        <h1>{`EDITAR ${this.props.model.toUpperCase()}` + code}</h1>
        <Link to={`/admin/productdepartments/edit/${this.props.previousProductDepartment}`}>
          <span className={`previous fa fa-chevron-circle-left`} />
        </Link>
        <Link to={`/admin/productdepartments/edit/${this.props.nextProductDepartment}`}>
          <span className='next fa fa-chevron-circle-right' />
        </Link>
        <span onClick={this.toggleBar.bind(this)} className='list fa fa-list' />
      </div>

      {content}
    </div>

  }

}
