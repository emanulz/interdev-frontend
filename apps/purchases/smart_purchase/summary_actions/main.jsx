import React from 'react'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
const uuidv4 = require('uuid/v4')
import Select2 from 'react-select2-wrapper'
import {generalSave} from '../../../../utils/api.js'

@connect(store=>{
    return {
        document_data_selected: store.smart_purchase.document_data_selected,
        selectedFile: store.smart_purchase.selectedFile,
        purchase_type: store.smart_purchase.purchase_type

    }
})
export default class Summary_Actions extends React.Component {



    createNewSupplier(e){
        if(this.props.document_data_selected === null){
            return
        }
        let sup = this.props.document_data_selected.emisor
        const supplier_data = {
            name: sup.Nombre,
            id_type: sup.Tipo_raw =="02" ? "JUR": "PER", 
            id_num: sup.Numero, 
            phone_number: sup.Telefono, 
            email: sup.CorreoElectronico,
            
        }

        const supplier_kwargs = {
            url: '/api/suppliers/',
            method: 'post',
            successType: 'NEW_SUPPLIER_CREATED',
            errorType: 'ERROR_CREATING_SUPPLIER',
            data: supplier_data,
            sucessMessage: "Proveedor creado correctamente",
            errorMessage: 'Error creando proveedor',

        }

        //dispatch the creation
        this.props.dispatch(generalSave(supplier_kwargs))
    }

    displaySupplierSearch(){
        this.props.dispatch({type: 'supplierLinker_TOGGLE_SEARCH_PANEL'})
    }

    
    acceptRejectPurchase(response){

        this.props.dispatch({type:'FETCHING_STARTED'})

        const formData = new FormData()
        formData.append('file', this.props.selectedFile)
        formData.append('taxpayer_response', response)
        formData.append('token', uuidv4())
        formData.append('purchase_type', this.props.purchase_type)

        const kwargs = {
            url: '/api/facturareception/processHaciendaXML/',
            method: 'post',
            successType: 'HACIENDA_RECEPTION_STARTED',
            errorType: 'ERROR_STARTING_DOC_RECEPTION',
            data: formData,
            succesMessage: "Proceso de Recepción iniciado correctamente",
            errorMessage: "Ocurrio un error iniciando la aceptación ante Hacienda"
        }
        //place a confirm
        const dispatch = this.props.dispatch
        const reponse_text = response === "ACCEPTED" ? "ACEPTAR" : "RECHAZAR"
        alertify.confirm('Aceptar', 
            `¿Desea ${reponse_text} esta factura ante Hacienda? Esta acción no se puede deshacer.`,
            ()=>{
                dispatch({type:"FETCHING_STARTED"})
                dispatch(generalSave(kwargs))
            },
            ()=>{
                dispatch({type:"FETCHING_DONE"})
                return true
            }
        ).set(
            'labels', {
                ok: 'Aceptar',
                cancel: 'Cancelar'
            }
        )

    }

    acceptPurchase(){
        return this.acceptRejectPurchase("ACCEPTED")
    }

    rejectPurchase(){
        return this.acceptRejectPurchase("REJECTED")
    }


    goToStepB(){
        this.props.dispatch({type: "GO_TO_STEP", payload: "b"})
    }

    handlePurTypeChange(event) {
        const value = event.target.value
        const name = event.target.name

        this.props.dispatch({type: 'UPDATE_PURCHASE_TYPE', payload: value})
      }

    render(){



        let acceptDocument = ''
        let rejectDocument = ''
        let associateSupplier = ''
        let createSupplier = ''
        let associateCodes = ''
        let pur_type = ''

        const doc = this.props.document_data_selected
        if(doc !=null){

            //show the reject document
            rejectDocument = <div className="doc-actions-action"
                onClick={this.rejectPurchase.bind(this)}>
                <div className="doc-actions-action-row">
                    <div>Rechazar Factura</div>
                    <i className="fa fa-times"></i>
                </div>
                <div className="doc-actions-action-row">
                    <p>Rechazar compra ante Hacienda</p>
                </div>
            </div>

            //make the accept conditional to the invoice
            //not having been accepted

            if(!doc.already_accepted){

                const data = [
                    {
                        text: 'Compra',
                        id: 'PURCHASE'
                    },
                    {
                        text: 'Gasto',
                        id: 'EXPENSE'
                    }
                ]
                pur_type = <Select2
                    name='pur_type'
                    value={this.props.purchase_type}
                    data={data}
                    className='form-control'
                    onSelect={this.handlePurTypeChange.bind(this)}
                    options={{
                    placeholder: 'Elija un tipo de gasto...',
                    noResultsText: 'Sin elementos'
                    }}
                />

                
                acceptDocument = <div className="doc-actions-action"
                onClick={this.acceptPurchase.bind(this)}>
                <div className="doc-actions-action-row">
                    <div>Aceptar Factura</div>
                    <i className="fa fa-check"></i>
                </div>
                <div className="doc-actions-action-row">
                    <p>Aceptar compra ante Hacienda</p>
                </div>
            </div>
            }

            if(doc.proveedor=="not_found"){
                associateSupplier = <div className="doc-actions-action"
                    onClick={this.displaySupplierSearch.bind(this)}>
                    <div className="doc-actions-action-row">
                        <div>Asociar Proveedor</div>
                        <i className="fa fa-link"></i>
                    </div>
                    <div className="doc-actions-action-row">
                    <p>Asociar un proveedor con uno ya existente en el sistema</p>
                    </div>
            </div>

            createSupplier = <div className="doc-actions-action"
                onClick={this.createNewSupplier.bind(this)}>
                <div className="doc-actions-action-row">
                    <div>Crear Proveedor</div>
                    <i className="fa fa-plus"></i>
                </div>
                <div className="doc-actions-action-row">
                <p>Crear un nuevo proveedor con los datos de la factura</p>
                </div>
            </div>

            }
            if(!doc.already_loaded && doc.proveedor !=="not_found"){
                associateCodes = <div className="doc-actions-action"
                    onClick={this.goToStepB.bind(this)}>
                    <div className="doc-actions-action-row">
                        <div>Asociar Códigos</div>
        <               i className="fa fa-upload"></i>
                    </div>
                    <div className="doc-actions-action-row">
                        <p>Relacionar códigos de proveedor con internos</p>
                    </div>
                </div>
            }
        }





        return <div className="doc-actions">
            <h1 className="section_header">Acciones Disponibles</h1>
            <hr/>
            {pur_type}
            {acceptDocument}
            {rejectDocument}
            
            {associateSupplier}
            {createSupplier}
            {associateCodes}

        </div>
    }
}





