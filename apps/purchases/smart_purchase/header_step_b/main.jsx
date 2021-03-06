import React from 'react'
import {connect} from 'react-redux'

import Select2 from 'react-select2-wrapper'

import {uploadXmlForProcessing} from '../actions.js'

@connect(store=>{
    return {
        currentStep: store.smart_purchase.currentStep,
        documents_data: store.smart_purchase.documents_data,
        invoice_to_link: store.smart_purchase.invoice_to_link,
        files: store.smart_purchase.files
    }
})
export default class StepB_Header extends React.Component{

 
    onDropDownSelection(e){
        //dispatch an XML upload where the full data of the xml will be parsed

        this.props.dispatch({type: 'FETCHING_STARTED'})
        
        const target_doc = this.props.documents_data.find(item =>{
            return item.header.NumeroConsecutivo === e.target.value
        })

        const target_file = this.props.files.find(item=>{
            return item.name === target_doc.file_name            
        })

        const formData = new FormData()
        formData.append(target_file.name, target_file)
        formData.append('preprocess', false)

        const kwargs = {
            url: '/api/purchase/smart_purchase/',
            data: formData,
            successDispatch: 'SET_INVOICE_TO_LINK'
        }

        this.props.dispatch(uploadXmlForProcessing(kwargs))


    }

    goToStepA(){
        this.props.dispatch({type: 'GO_TO_STEP', payload: 'a'})
    }

    goToStepC(){
        this.props.dispatch({type: 'GO_TO_STEP', payload: 'c'})
    }

    render(){

        //build the dropdown options from the available documents
        const invoices_data = this.props.documents_data.map(invoice=>{
            return {text:invoice.header.NumeroConsecutivo, id: invoice.header.NumeroConsecutivo}
        })

        let supplier_name = ''
        if(this.props.invoice_to_link){
            if(this.props.invoice_to_link.emisor.NombreComercial && this.props.invoice_to_link.emisor.NombreComercial !== ''){
                supplier_name = this.props.invoice_to_link.emisor.NombreComercial
            }else{
                supplier_name = this.props.invoice_to_link.emisor.Nombre
            }
        }
        
        return <div className="stepb-header">
            <div className="stepb-header-legend">
                <i className="fa fa-arrow-left fa2x"
                 onClick={this.goToStepA.bind(this)}></i>
                <h1>Asociación de códigos de Producto para Proveedor</h1>
                <i className="fa fa-arrow-right fa2x"
                 onClick={this.goToStepC.bind(this)}></i>
            </div>
            
            <div className="stepb-header-dropdown">
                <div>
                    <Select2
                    name='invoices_select'
                    // value={this.props.invoice_to_link}
                    className='form-control'
                    onSelect={this.onDropDownSelection.bind(this)}
                    data={invoices_data}
                    options={{
                        placeholder: 'Elija una factura...',
                        noResultsText: 'Sin elementos'
                    }}
                    />
                </div>
                <div id="stepb-header-supplier">
                    <div>Proveedor:</div>
                    <div>{supplier_name}</div>
                </div>
            </div>

        </div>
    }

}
