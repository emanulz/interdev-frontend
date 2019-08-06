import React from 'react'
import { connect } from 'react-redux'
import Select2 from 'react-select2-wrapper'
import { getItemDispatch } from '../../../../utils/api'
import { checkImportData, importProducts } from './actions.js'

@connect(store => {
  return {
    destination_warehouse: store.Importer.destination_warehouse,
    warehouses_options: store.Importer.warehouses_options,
    file: store.Importer.file
  }
})
export default class Importer extends React.Component {

  componentWillMount() {
    this.props.dispatch({ type: 'FETCHING_STARTED' })
    this.props.dispatch({ type: 'CLEAR_WAREHOUSES' })

    const kwargs = {
      url: '/api/warehouses/',
      successType: 'FETCH_WAREHOUSES_FULFILLED',
      errorType: 'FETCH_WAREHOUSES_REJECTED'
    }
    this.props.dispatch(getItemDispatch(kwargs))

  }

  onFileChange(e) {
    console.log('Archivo seleccionado --> ', e)
    this.props.dispatch({ type: 'FILE_SELECTED', payload: e.target.files[0] })
    // this.props.dispatch({type:'SET_IMAGE_FILE', payload:e.target.files[0]})
  }

  onSelectedWarehouseChange(e) {
    this.props.dispatch({ type: 'WAREHOUSE_SELECTED', payload: e.target.value })
  }

  onImportProducts(e) {
    console.log('Import products start')

    const is_valid = checkImportData(this.props.destination_warehouse, this.props.file)
    // a warehouse must be selected
    if (!is_valid) {
      return
    }
    console.log('Data is valid')
    const formData = new FormData()
    formData.append('products_file', this.props.file)
    formData.append('warehouse', this.props.destination_warehouse.id)
    const import_kwargs = {
      url: '/api/importer/importFromExcel/',
      data: formData
    }

    console.log('Data OK, dispatching import')
    this.props.dispatch(importProducts(import_kwargs))
  }

  render() {
    return <div className='product-importer'>

      <div className='product-importer-header'>
        <h1>Importación de Productos desde Excel</h1>
        <div className='product-importer-description'>
          <p>
            Para realizar la importación de productos desde el archivo utilice el explorador
            de archivos y seleccione el documento Excel .xlsx con los datos del producto.
            El arhivo debe estar en el formato de importación suministrado por los desarrolladores.
            Es posible desde la sección de herramientas de esta sección descargar el archivo machote
            de importación.
          </p>
        </div>
      </div>

      <div className='product-importer-body'>
        <div className='product-importer-body-left'>
          <h2>Archivo de Productos</h2>
          <hr />
          <div className='product-importer-body-left-picker'>
            <input type='file' name='file_picker' onChange={this.onFileChange.bind(this)} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' />
          </div>
          <div className='product-importer-body-left-select2'>
            <Select2
              name='warehouse_selecter'
              className='form-control'
              onSelect={this.onSelectedWarehouseChange.bind(this)}
              data={this.props.warehouses_options}
              options={{
                placeholder: 'Elija la bodega de destino...',
                noResultsText: 'Sin elementos'
              }}
            />
          </div>

          <button className='form-control btn-primary product-importer-btn product-importer-btn-import'
            onClick={this.onImportProducts.bind(this)}>
            Importar Productos
          </button>

        </div>

        <div className='product-importer-body-right'>
          <h2>Acciones</h2>
          <hr />

          <button className='form-control btn-primary product-importer-btn'>
            Descargar Machote Importación
          </button>

          <button className='form-control btn-primary product-importer-btn'>
            Descargar Catálogo Productos
          </button>
        </div>
      </div>

      <div className='product-importer-footer'>
        <h2>Resultados Importación</h2>
        <hr />
      </div>
    </div>
  }
}
