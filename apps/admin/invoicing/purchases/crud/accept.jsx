/*
 * Module dependencies
 */
import React from 'react'
import Upload from './accept/upload.jsx'
import ViewInvoice from './accept/viewInvoice.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    permissions: store.clientsAdmin.permissions,
    loadedPurchase: store.epurchases.loadedPurchase
  }
})
export default class Update extends React.Component {

  // Main Layout
  render() {

    const content = Object.keys(this.props.loadedPurchase).length
      ? <div className='heigh100'>
        <ViewInvoice />
      </div>
      : <div className='heigh100 accept-purchase'>
        <Upload />
      </div>

    return <div className='create heigh100'>
      <div className='create-edit-header'>
        <h1>ACEPTAR FACTURA DE GASTO/COMPRA</h1>
      </div>
      {content}

    </div>

  }

}
