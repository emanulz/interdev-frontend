import React from 'react'
import {connect} from 'react-redux'

import { getItemDispatch } from '../../../../utils/api.js'
let inspect = require('util-inspect')
import CSVReader from 'react-csv-reader'
import {joinINV_CAT, saveProdInBatches, saveImportedProduct, importTestProducts, importFakeSuppliers, generateProductInvMovs} from './actions.js'

import alertify from 'alertifyjs'

@connect(store =>{
    return {
        products: store.productImporter.products,
        cat_data: store.productImporter.cat_data,
        inv_data: store.productImporter.inv_data,
        joint_data: store.productImporter.joint_data,
    }
})
export default class ImportProducts extends React.Component {
    
    componentWillMount(){
        //clear all data and refetch products
        this.props.dispatch({type:'FETCHING_STARTED'})
        this.props.dispatch({type:'CLEAR_PRODUCTS_IMPORT'})
        this.props.dispatch({type:'CLEAR_CAT_DATA'})
        this.props.dispatch({type:'CLEAR_INV_DATA'})
        this.props.dispatch({type:'CLEAR_JOINT_DATA'})

        const kwargs = {
            url: '/api/products',
            successType: 'PRODUCTS_FETCH_FULFILLED_IMPORT',
            errorType: 'FETCH_PRODUCTS_REJECTED'
        }

        //this.props.dispatch(getItemDispatch(kwargs))
    }


    readCatalogue(data, file) {
        let start_flag = true
        const clean_data = data.map(i=>{
            return {
                code:i[0].startsWith('0')?i[0].slice(1):i[0],
                supplier_code:i[2],
                description: i[3],
                short_description: i[4],
                unit: i[5],
                price_ivi:i[7]
            }
        })

        //remove the initial rows that are not products
        const start_index = clean_data.findIndex(a => a.code === 'Código')

        this.props.dispatch({type:'SET_CAT_DATA', payload:clean_data.slice(start_index+1)})
    }

    readInventory(data, file) {
        const clean_data = data.map(i=>{
            return {
                code:i[0].startsWith('0')?i[0].slice(1):i[0],
                qty:parseFloat(i[2]),
                cost:i[3]
            }
        })
        //remove the initial rows that are not products
        const start_index = clean_data.findIndex(a => a.code === 'Código')

        this.props.dispatch({type:'SET_INV_DATA', payload:clean_data.slice(start_index+1)})
    }


    handleImport(){
        const warehouse = "9d85cecc-feb1-4710-9a19-0a187580e15e"
        const patched_data = joinINV_CAT(this.props.cat_data, this.props.inv_data)
        const prods_data = patched_data.map(prod=>{
            return saveImportedProduct(prod, warehouse)
        })
        this.props.dispatch({type: 'SET_JOINT_DATA', payload: prods_data})

        //do batch imports for the products instead of mass imports all prods
        let start = 0
        let temp_end =  start + 10
        const total = prods_data.length - 1

        saveProdInBatches(start, temp_end, total, prods_data, warehouse)

        //saveImportedProduct(patched_data[0])
        // const prod_promises = patched_data.map(data=>{
        //     return saveImportedProduct(data)
        // })

        // Promise.all(prod_promises).then(results=>{
        //     alertify.alert('Éxito', 'Éxito importando los productos')
        // })
        
    }



    handleJunkSuppliers(){
        importFakeSuppliers(26, 15000)
    }

    handleJunkInvMovs(){
        generateProductInvMovs(50000)
    }

    handleJunkImport(){
        console.log('IMPORT START')

        //2399950
        let start = 3300000
        let end = 3400000
        let promises = importTestProducts(start, end)
        let initialPromise = Promise.resolve([])
        promises.reduce((promiseChain, currentPromise)=>{
            return promiseChain.then(currentPromise)
        },
        initialPromise
        )
    }

    errorReadingFile(err){
        console.log('ERR --> ' + err)
    }

    render(){
        return <div className='product-importer' >
            <h1>PLEASE IMPORT ME!</h1>
            <CSVReader
                cssClass="csv-input"
                label="Seleccionar archivo Catálogo"
                onFileLoaded={this.readCatalogue.bind(this)}
                onError={this.errorReadingFile}
            />

            <CSVReader
                cssClass="csv-input"
                label="Seleccionar archivo Inv"
                onFileLoaded={this.readInventory.bind(this)}
                onError={this.errorReadingFile}
            />

            <button onClick={this.handleImport.bind(this)} >Importar productos</button>

            <button onClick={this.handleJunkImport.bind(this)} >Importar productos prueba</button>

            <button onClick={this.handleJunkSuppliers.bind(this)} >Importar proveedores</button>
            <button onClick={this.handleJunkInvMovs.bind(this)} >Generar Movimientos</button>

        </div>

    }
}