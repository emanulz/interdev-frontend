/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../general/search/searchAdmin.jsx'
import {loadGlobalConfig} from '../../../../utils/api.js'
import styles from './labels.sass'
const Barcode = require('react-barcode')

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    searchResults: store.adminSearch.searchResults,
    labelStyles: store.config.labelStyles
  }
})
export default class LabelPrinting extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      product: {}
    }
  }

  componentDidMount() {
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})
    this.props.dispatch(loadGlobalConfig('label_styles', false, 'FETCH_LABEL_STYLES_FULFILLED', 'FETCH_LABEL_STYLES_REJECTED'))
  }

  componentWillUnMount() {
    this.props.dispatch({type: `adminSearch_CLEAR_SEARCH_RESULTS`, payload: ''})
  }

  setProductActiveForPrint = (product) => {
    const newState = {...this.state}
    newState.product = product
    this.setState(newState)
  }

  printLabel() {
    window.printDiv('print-label-label', [])
  }

  render() {

    const headerOrder = [
      {
        field: 'code',
        text: 'Código',
        width: '150px'
      }, {
        field: 'description',
        text: 'Descripción'
      }, {
        field: 'sell_price1',
        text: 'Precio de Venta',
        type: 'price'
      }, {
        field: 'id',
        text: 'Etiqueta',
        type: 'function_on_click_pass_element',
        idUnique: 1,
        textToRender: 'Etiqueta',
        onClickFunction: this.setProductActiveForPrint
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : []
    const list = <AdminTable headerOrder={headerOrder} model='products' data={tableData}
      idField='id' sortedBy='code' />
    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Impresión de etiquetas de Productos:</h1>
      </div>
      <SearchAdmin model='product' namespace='adminSearch' />
      {this.labelDiv()}
      {content}
    </div>
  }

  // COMPONENT FOR LABEL PRINTING
  labelDiv = () => {
    const price = this.state.product.sell_price1 ? `₡ ${parseFloat(this.state.product.sell_price1).formatMoney(2, ',', '.')}` : 0
    const code = this.state.product.code ? this.state.product.code : ''
    const description = this.state.product.description ? this.state.product.description : ''
    const descriptionMaxLength = this.props.labelStyles.descriptionMaxLength ? this.props.labelStyles.descriptionMaxLength : 40
    const trimmedDescription = description.length <= descriptionMaxLength
      ? description
      : description.substring(0, descriptionMaxLength - 1)

    const fontFamily = this.props.labelStyles.labelFontFamily ? this.props.labelStyles.labelFontFamily : 'Arial'
    const codeFontSize = this.props.labelStyles.codeFontSize ? this.props.labelStyles.codeFontSize : '12px'
    const descriptionFontSize = this.props.labelStyles.descriptionFontSize ? this.props.labelStyles.descriptionFontSize : '12px'
    const priceFontSize = this.props.labelStyles.priceFontSize ? this.props.labelStyles.priceFontSize : '12px'

    const labelItemStyles = {
      border: '1px solid #cacaca',
      display: 'flex',
      flexFlow: 'column',
      fontFamily: fontFamily,
      width: '227px'
    }
    const spanStyles = {
      display: 'block',
      padding: '2px 0',
      width: '100%',
      textAlign: 'center',
      fontFamily: fontFamily,
      margin: 0
    }

    // CUSTOM LABEL STYLES
    const codeStyles = {
      ...spanStyles,
      fontSize: codeFontSize
    }
    const descriptionStyles = {
      ...spanStyles,
      fontSize: descriptionFontSize
    }
    const priceStyles = {
      ...spanStyles,
      fontSize: priceFontSize
    }
    const barcodeStyles = {
      ...spanStyles,
      maxWidth: '100%',
      padding: '0'
    }

    const barcodeHeight = this.props.labelStyles.barcodeHeight ? this.props.labelStyles.barcodeHeight : 15
    const barcode = this.props.labelStyles.printBarcode
      ? <span style={barcodeStyles}><Barcode value={code} width='1' height={barcodeHeight} fontSize={codeFontSize} /> </span>
      : <div />

    const codeSpan = !this.props.labelStyles.printBarcode
      ? <span style={codeStyles}>COD: {this.state.product.code}</span>
      : <div />

    const component = this.state.product.code
      ? <div className='print-label'>
        <div id='print-label-label' style={labelItemStyles}>
          {codeSpan}
          <span style={priceStyles}>{price}</span>
          <span style={descriptionStyles}>{trimmedDescription}</span>
          {barcode}
        </div>
        <div className='print-label-print'>
          <button onClick={this.printLabel.bind(this)} className='btn btn-primary'>Imprimir</button>
        </div>
      </div>
      : <div />
    return component
  }
}
