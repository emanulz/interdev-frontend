import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
import {checkReferenceDocData} from './actions.js'

@connect((store) => {
  return {
    referenceDocData: store.referenceDocs.referenceDocData,
    isVisible: store.referenceDocs.isVisible,
    isAdded: store.referenceDocs.referenceDocAdded
  }
})
export default class RefereceDocPanel extends React.Component {

  hidePanel() {
    this.props.dispatch({type: 'HIDE_REFERENCE_DOC_PANEL', payload: -1})
  }

  handleInputChange(event) {
    this.props.dispatch({type: 'CLEAR_REFERENCE_DOC_ADDED', payload: true})
    const target = event.target
    let value
    // const value = target.type === 'checkbox' ? target.checked : target.value
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
      case 'select-one':
      {
        value = target.value
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const referenceDocData = {
      ...this.props.referenceDocData
    }

    referenceDocData[name] = value

    this.props.dispatch({type: 'SET_REFERENCE_DOC_DATA', payload: referenceDocData})
  }

  addReferenceDoc() {
    const validaData = checkReferenceDocData(this.props.referenceDocData)
    if (validaData) {
      this.props.dispatch({type: 'SET_REFERENCE_DOC_ADDED', payload: true})
      this.props.dispatch({type: 'HIDE_REFERENCE_DOC_PANEL', payload: -1})
    }
  }

  clearReferenceDoc() {
    this.props.dispatch({type: 'CLEAR_REFERENCE_DOC_ADDED', payload: false})
    this.props.dispatch({type: 'CLEAR_REFERENCE_DOC_DATA', payload: false})
    this.props.dispatch({type: 'HIDE_REFERENCE_DOC_PANEL', payload: -1})
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'referenceDoc-panel is-visible'
      : 'referenceDoc-panel'

    const documentTypes = [
      {text: `01 - Factura Electrónica`, id: '01'},
      {text: `02 - Nota de Débito Electrónica`, id: '02'},
      {text: `03 - Nota de Crédito Electrónica)`, id: '03'},
      {text: `04 - Tiquete Electrónico`, id: '04'},
      {text: `05 - Nota de Despacho`, id: '05'},
      {text: `06 - Contrato`, id: '06'},
      {text: `07 - Procedimiento`, id: '07'},
      {text: `08 - Comprobante en Contingencia`, id: '08'},
      {text: `09 - Devolución de Mercadería`, id: '09'},
      {text: `99 - Otros`, id: '99'}
    ]

    const documentCodes = [
      {text: `01 - Anula Documento de Referencia`, id: '01'},
      {text: `02 - Corrige Texto de Referencia`, id: '02'},
      {text: `03 - Corrige Monto de Referencia)`, id: '03'},
      {text: `04 - Rerefencia Otro Documento`, id: '04'},
      {text: `05 - Sustituye Provisional`, id: '05'},
      {text: `99 - Otros`, id: '99'}
    ]

    const addReferenceDocButton = this.props.isAdded
      ? <button className='form-control btn btn-danger' onClick={this.clearReferenceDoc.bind(this)} disabled={!this.props.isAdded || !this.props.isVisible}>
        Remover Documento
        <i className='fa fa-map' />
      </button>
      : <button className='form-control btn btn-primary' onClick={this.addReferenceDoc.bind(this)} disabled={this.props.isAdded || !this.props.isVisible}>
        Agregar Documento
        <i className='fa fa-map' />
      </button>

    return <div className={isVisible}>
      <div className='referenceDoc-panel-header'>
        DATOS DEL DOCUMENTO DE REFERENCIA
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='referenceDoc-panel-container'>
        <div className='form-group col-xs-8'>
          <label>Tipo de documento:</label>
          <Select2
            name='documentType'
            data={documentTypes}
            value={this.props.referenceDocData.documentType}
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            options={{
              placeholder: 'Elija un tipo de documento...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>
        <div className='form-group col-xs-8'>
          <label>Código de Referencia:</label>
          <Select2
            name='documentCode'
            data={documentCodes}
            value={this.props.referenceDocData.documentCode}
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            options={{
              placeholder: 'Elija un Código de Referencia de Documento...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>
        <div className='form-group col-xs-8'>
          <label># Documento</label>
          <input value={this.props.referenceDocData.documentNumber} name='documentNumber' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>
        <div className='form-group col-xs-8 button-container'>
          {addReferenceDocButton}
        </div>
      </div>
    </div>

  }

}
