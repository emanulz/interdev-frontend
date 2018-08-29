/*
 * Module dependencies
 */
import React from 'react'
import Upload from './accept/upload.jsx'

import Unauthorized from '../../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import CreateButtons from './accept/createButtons.jsx'

@connect((store) => {
  return {
    permissions: store.clients.permissions,
    loadedPurchase: store.epurchases.loadedPurchase
  }
})
export default class Update extends React.Component {

  // Main Layout
  render() {

    const content = Object.keys(this.props.loadedPurchase).length
      ? <div className='heigh100'>
        LOADED
        <Upload />
        <CreateButtons />
      </div>
      : <div className='heigh100 accept-purchase'>
        <Upload />
      </div>

    return <div className='create heigh100'>
      <div className='create-edit-header'>
        <h1>ACEPTAR FACTURA COMPRA</h1>
      </div>
      {content}

    </div>

  }

}
