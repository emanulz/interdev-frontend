import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
import {checkExemptionData} from './actions.js'

@connect((store) => {
  return {
    exemptionData: store.taxExemption.exemptionData,
    isVisible: store.taxExemption.isVisible,
    isExempt: store.cart.isExempt}
})
export default class TaxExemptionPanel extends React.Component {

  hidePanel() {
    this.props.dispatch({type: 'HIDE_EXEMPTION_PANEL', payload: -1})
  }

  handleInputChange(event) {
    this.props.dispatch({type: 'CLEAR_EXEMPT_SALE', payload: true})
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

    const exemptionData = {
      ...this.props.exemptionData
    }

    exemptionData[name] = value

    this.props.dispatch({type: 'SET_EXEMPTION_DATA', payload: exemptionData})
  }

  exemptSale() {
    const validaData = checkExemptionData(this.props.exemptionData)
    if (validaData) {
      this.props.dispatch({type: 'EXEMPT_SALE', payload: true})
      this.props.dispatch({type: 'HIDE_EXEMPTION_PANEL', payload: -1})
    }
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'exemption-panel is-visible'
      : 'exemption-panel'

    const documentTypes = [
      {text: `01 - Compras Autorizadas`, id: '01'},
      {text: `02 - Ventas exentas a diplomaticos`, id: '02'},
      {text: `03 - Orden de compra (instituciones públicas y otros organismos)`, id: '03'},
      {text: `04 - Exenciones Dirección general de tributación`, id: '04'},
      {text: `05 - Zonas Francas`, id: '05'},
      {text: `99 - Otros`, id: '99'}
    ]

    return <div className={isVisible}>
      <div className='exemption-panel-header'>
        DATOS DE LA EXONERACIÓN
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='exemption-panel-container'>
        <div className='form-group col-xs-8'>
          <label>Tipo de documento:</label>
          <Select2
            name='documentType'
            data={documentTypes}
            value={this.props.exemptionData.documentType}
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            options={{
              placeholder: 'Elija un tipo de documento...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>
        <div className='form-group col-xs-8'>
          <label># Documento</label>
          <input value={this.props.exemptionData.documentNumber} name='documentNumber' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>
        <div className='form-group col-xs-8'>
          <label>Nombre de la institución</label>
          <input value={this.props.exemptionData.institutionName} name='institutionName' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>
        <div className='form-group col-xs-8'>
          <label>Fecha del documento</label>
          <input value={this.props.exemptionData.documentDate} name='documentDate' onChange={this.handleInputChange.bind(this)} type='date'
            className='form-control' />
        </div>
        <div className='form-group col-xs-8 button-container'>
          <button className='form-control btn btn-primary' onClick={this.exemptSale.bind(this)} disabled={this.props.isExempt}>
            Exonerar
            <i className='fa fa-map' />
          </button>
        </div>
      </div>
    </div>

  }

}