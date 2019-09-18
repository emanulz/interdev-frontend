/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    disabled: store.completed.completed,
    globalConf: store.config.globalConf,
    supplierName: store.selfpurchase.supplierName,
    relatedDocument: store.selfpurchase.relatedDocument
  }
})
export default class Buttons extends React.Component {

  setSupplierName(event) {
    const value = event.target.value
    this.props.dispatch({type: 'SET_SELFPURCHASE_SUPPLIER_NAME', payload: value})
  }

  setRelatedDoc(event) {
    const value = event.target.value
    this.props.dispatch({type: 'SET_SELFPURCHASE_RELATED_DOC', payload: value})
  }
  // Main Layout
  render() {

    return <div className='related-fields col-xs-12'>
      <div className='form-group'>
        <label>Proveedor</label>
        <input value={this.props.supplierName} name='supplierName'
          onChange={this.setSupplierName.bind(this)}
          type='text'
          className='form-control' />
      </div>
      <div className='form-group'>
        <label>N. Documento</label>
        <input value={this.props.relatedDocument} name='relatedDocument'
          onChange={this.setRelatedDoc.bind(this)}
          type='text'
          className='form-control' />
      </div>
    </div>

  }

}
