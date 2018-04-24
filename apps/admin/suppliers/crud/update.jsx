/*
 * Module dependencies
 */
import React from 'react'
import Form from './form/form.jsx'

import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import {setNextPrevItem} from '../../../../utils/api'
import {Link} from 'react-router-dom'
import UpdateButtons from './form/updateButtons.jsx'
import ItemsBar from '../../layout/itemsBar/itemsBar.jsx'
import {toggleItemsBar} from '../../layout/itemsBar/actions'

@connect((store) => {
  return {
    permissions: store.suppliers.permissions,
    supplier: store.suppliers.supplierActive,
    nextSupplier: store.suppliers.nextSupplier,
    previousSupplier: store.suppliers.previousSupplier,
    suppliers: store.suppliers.suppliers
  }
})
export default class Update extends React.Component {

  componentDidMount() {
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_SUPPLIER', payload: ''})
  }

  componentWillUpdate(nextProps) {

    const code = this.props.location.pathname.split('/').pop()

    if (nextProps.nextSupplier == 0 && nextProps.previousSupplier == 0 && nextProps.suppliers.length) {

      const kwargs = {
        items: [
          ...nextProps.suppliers
        ],
        codeField: 'code',
        code: code,
        dispatchType: 'SET_NEXT_PREV_SUPPLIER'
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
        content = <div />
        break
      } // case
    }

    return <div className='create heigh100'>
      <div className='create-edit-header'>
        <h1>EDITAR PROVEEDOR {code}</h1>
        <Link to={`/admin/suppliers/edit/${this.props.previousSupplier}`}>
          <span className={`previous fa fa-chevron-circle-left`} />
        </Link>
        <Link to={`/admin/suppliers/edit/${this.props.nextSupplier}`}>
          <span className='next fa fa-chevron-circle-right' />
        </Link>
        <span onClick={this.toggleBar.bind(this)} className='list fa fa-list' />
      </div>

      {content}

      <ItemsBar items={this.props.suppliers} tittle='Lista de Proveedores' codeField='code' descriptionField='name'
        descriptionField2={false} editPath='/admin/suppliers/edit/' />
    </div>

  }

}
