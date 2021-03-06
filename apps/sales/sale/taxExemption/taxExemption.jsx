import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
import {checkExemptionData} from './actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    conf: store.config.globalConf,
    exemptionData: store.taxExemption.exemptionData,
    isVisible: store.taxExemption.isVisible,
    isExempt: store.taxExemption.isExempt}
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

    console.log('NAME-->', name)
    console.log('VALUE-->', value)

    if (name == 'salePercent') {
      if (value > 100 || value < 0) {
        alertify.alert('ERROR', `El valor de porcentaje de exoneración no puede ser mayor a 100% o menor a 0%, el valor digitado fue ${value}%`)
        return false
      }
    }

    const exemptionData = {
      ...this.props.exemptionData
    }

    exemptionData[name] = value

    this.props.dispatch({type: 'SET_EXEMPTION_DATA', payload: exemptionData})
  }

  decideExemptionMethod() {
    if (this.props.conf.usesNewExemptionProcess) {
      this.exemptSaleNew()
    } else {
      this.exemptSale()
    }
  }

  exemptSale() {
    const validaData = checkExemptionData(this.props.exemptionData)
    if (validaData) {
      const exemptData = {
        percentage: this.props.exemptionData.salePercent
      }
      this.props.dispatch({type: 'EXEMPT_SALE', payload: true})
      this.props.dispatch({type: 'SET_SALE_EXEMPT', payload: true})
      this.props.dispatch({type: 'SET_SALE_EXEMPT_PERCENTAGE', payload: exemptData})
      this.props.dispatch({type: 'HIDE_EXEMPTION_PANEL', payload: -1})
    }
  }

  exemptSaleNew() {
    const validaData = checkExemptionData(this.props.exemptionData)
    if (validaData) {
      const exemptData = {
        percentage: this.props.exemptionData.salePercent
      }
      this.props.dispatch({type: 'EXEMPT_SALE', payload: true})
      this.props.dispatch({type: 'SET_SALE_EXEMPT', payload: true})
      this.props.dispatch({type: 'SET_SALE_EXEMPT_PERCENTAGE_NEW', payload: exemptData})
      this.props.dispatch({type: 'HIDE_EXEMPTION_PANEL', payload: -1})
    }
  }

  notExemptSale() {
    this.props.dispatch({type: 'CLEAR_SALE_EXEMPT', payload: false})
    this.props.dispatch({type: 'CLEAR_EXEMPTION_DATA', payload: false})
    this.props.dispatch({type: 'HIDE_EXEMPTION_PANEL', payload: -1})
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

    const exemptPercentageOptions = [
      {text: `1%`, id: 1},
      {text: `2%`, id: 2},
      {text: `3%`, id: 3},
      {text: `4%`, id: 4},
      {text: `5%`, id: 5},
      {text: `6%`, id: 6},
      {text: `7%`, id: 7},
      {text: `8%`, id: 8},
      {text: `9%`, id: 9},
      {text: `10%`, id: 10},
      {text: `11%`, id: 11},
      {text: `12%`, id: 12},
      {text: `13%`, id: 13}
    ]

    const exemptPercentageInput = this.props.conf.usesNewExemptionProcess
      ? <div className='form-group col-xs-8'>
        <label>% Exoneración</label>
        <Select2
          name='salePercent'
          data={exemptPercentageOptions}
          value={this.props.exemptionData.salePercent}
          className='form-control'
          onSelect={this.handleInputChange.bind(this)}
          options={{
            placeholder: 'Elija un % de exoneración...',
            noResultsText: 'Sin elementos'
          }}
        />
      </div>
      : <div className='form-group col-xs-8'>
        <label>% Exoneración</label>
        <input value={this.props.exemptionData.salePercent} name='salePercent' onChange={this.handleInputChange.bind(this)} type='number'
          className='form-control' />
      </div>

    const exemptButton = this.props.isExempt
      ? <button className='form-control btn btn-danger' onClick={this.notExemptSale.bind(this)} disabled={!this.props.isExempt || !this.props.isVisible}>
        No-Exonerar
        <i className='fa fa-map' />
      </button>
      : <button className='form-control btn btn-primary' onClick={this.decideExemptionMethod.bind(this)} disabled={this.props.isExempt || !this.props.isVisible}>
        Exonerar
        <i className='fa fa-map' />
      </button>

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

        {exemptPercentageInput}

        <div className='form-group col-xs-8 button-container'>
          {exemptButton}
        </div>
      </div>
    </div>

  }

}
