import React from 'react'
import { connect } from 'react-redux'
import { loadGlobalConfig } from '../../../../utils/api.js'

import CSVReader from 'react-csv-reader'
import {
  joinINV_CAT, saveProdInBatches, saveImportedProduct, importTestProducts,
  importFakeSuppliers, generateProductInvMovs, imageProdTest, createProdWithImage
} from './actions.js'

@connect(store => {
  return {
    products: store.productImporter.products,
    cat_data: store.productImporter.cat_data,
    inv_data: store.productImporter.inv_data,
    joint_data: store.productImporter.joint_data,
    allow_negatives: store.productImporter.allow_negatives,
    sales_warehouse: store.productImporter.sales_warehouse,
    file: store.productImporter.file
  }
})
export default class ImportProducts extends React.Component {

  componentWillMount() {
    // clear all data and refetch products
    this.props.dispatch({ type: 'FETCHING_STARTED' })
    this.props.dispatch({ type: 'CLEAR_PRODUCTS_IMPORT' })
    this.props.dispatch({ type: 'CLEAR_CAT_DATA' })
    this.props.dispatch({ type: 'CLEAR_INV_DATA' })
    this.props.dispatch({ type: 'CLEAR_JOINT_DATA' })

    this.props.dispatch(loadGlobalConfig('inventory', 'workshop_warehouse',
      'SET_WORKSHOP_WAREHOUSE', 'CLEAR_WORKSHOP_WAREHOUSE'))

    this.props.dispatch(loadGlobalConfig('inventory', 'sales_warehouse',
      'SET_SALES_WAREHOUSE', 'CLEAR_SALES_WAREHOUSE'))
  }

  readCatalogue(data, file) {
    const clean_data = data.map(i => {
      return {
        code: i[0].startsWith('0') ? i[0].slice(1) : i[0],
        supplier_code: i[2],
        description: i[3],
        short_description: i[4],
        unit: i[5],
        price_ivi: i[7]
      }
    })

    // remove the initial rows that are not products
    const start_index = clean_data.findIndex(a => a.code === 'Código')

    this.props.dispatch({ type: 'SET_CAT_DATA', payload: clean_data.slice(start_index + 1) })
  }

  readInventory(data, file) {
    const clean_data = data.map(i => {
      return {
        code: i[0].startsWith('0') ? i[0].slice(1) : i[0],
        qty: parseFloat(i[2]),
        cost: i[3]
      }
    })
    // remove the initial rows that are not products
    const start_index = clean_data.findIndex(a => a.code === 'Código')

    this.props.dispatch({ type: 'SET_INV_DATA', payload: clean_data.slice(start_index + 1) })
  }

  handleImport() {
    const warehouse = this.props.sales_warehouse
    const patched_data = joinINV_CAT(this.props.cat_data, this.props.inv_data)
    const prods_data = patched_data.map(prod => {
      return saveImportedProduct(prod, warehouse, this.props.allow_negatives)
    })
    this.props.dispatch({ type: 'SET_JOINT_DATA', payload: prods_data })

    // do batch imports for the products instead of mass imports all prods
    let start = 0
    let temp_end = start + 10
    const total = prods_data.length - 1

    saveProdInBatches(start, temp_end, total, prods_data, warehouse)

  }

  handleJunkSuppliers() {
    importFakeSuppliers(26, 15000)
  }

  handleJunkInvMovs() {
    generateProductInvMovs(50000)
  }

  handleJunkImport() {
    console.log('IMPORT START')

    // 2399950
    let start = 3300000
    let end = 3400000
    let promises = importTestProducts(start, end)
    let initialPromise = Promise.resolve([])
    promises.reduce((promiseChain, currentPromise) => {
      return promiseChain.then(currentPromise)
    },
    initialPromise
    )
  }

  errorReadingFile(err) {
    console.log('ERR --> ' + err)
  }

  handleImageImport(e) {

    // create
    const prod_data = imageProdTest()

    console.log('Dispatch image uploader')

    createProdWithImage(prod_data, this.props.file)
  }

  onImageChange(e) {
    this.props.dispatch({ type: 'SET_IMAGE_FILE', payload: e.target.files[0] })
  }

  render() {
    return <div className='product-importer' >
      <h1>PLEASE IMPORT ME!</h1>
      <CSVReader
        cssClass='csv-input'
        label='Seleccionar archivo Catálogo'
        onFileLoaded={this.readCatalogue.bind(this)}
        onError={this.errorReadingFile}
      />

      <CSVReader
        cssClass='csv-input'
        label='Seleccionar archivo Inv'
        onFileLoaded={this.readInventory.bind(this)}
        onError={this.errorReadingFile}
      />
      <div>
        <div>Allow negatives?</div>
        <input type='checkbox' value={this.props.allow_negatives} />
      </div>

      <div>
        <div>Pick image file</div>
        <input type='file' name='image_picker' onChange={this.onImageChange.bind(this)} accept='image/png, image/jpeg' />
      </div>

      <button onClick={this.handleImageImport.bind(this)}>Upload image</button>

      <button onClick={this.handleImport.bind(this)} >Importar productos</button>

      <button onClick={this.handleJunkImport.bind(this)} >Importar productos prueba</button>

      <button onClick={this.handleJunkSuppliers.bind(this)} >Importar proveedores</button>
      <button onClick={this.handleJunkInvMovs.bind(this)} >Generar Movimientos</button>

    </div>

  }
}
