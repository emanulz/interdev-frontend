import React from 'react'
import {connect} from 'react-redux'

import {generalSave} from '../../../../utils/api.js'

@connect(store=>{
    return {
        show_confirmation: store.smart_purchase.show_sup_link_confirmation,
        to_link_supplier: store.smart_purchase.to_link_supplier,
        document_data_selected: store.smart_purchase.document_data_selected,
    }
})
export default class SupplierLinkerConfirmation extends React.Component {


    createSupplierLink(){
        console.log("Supplier selected on Linking confirmed")
        this.props.dispatch({type: "TOGGLE_SUP_LINK_CONFIRMATION"})
        //patch the supplier to have a matching id with the xml

    }

    abortLinking(){
        this.props.dispatch({type: "TOGGLE_SUP_LINK_CONFIRMATION"})
        this.props.dispatch({type: "CLEAR_TO_LINK_SUPPLIER"})
    }

    performLinking(){
        this.props.dispatch({type: "TOGGLE_SUP_LINK_CONFIRMATION"})
        const sup_data = {
            id: this.props.to_link_supplier.id,
            code: this.props.to_link_supplier.code,
            commercial_name: this.props.document_data_selected.emisor.NombreComercial,
            legal_name: this.props.document_data_selected.emisor.Nombre,
            id_num: this.props.document_data_selected.emisor.Numero,
            id_type: this.props.document_data_selected.emisor.Tipo_raw,
            email: this.props.document_data_selected.emisor.CorreoElectronico
        }

        const kwargs = {
            url: '/api/suppliers/linkSupplier/',
            method: 'post',
            data: sup_data,
            successType: 'SUPPLIER_LINKED',
            errorType: 'ERROR_LINKING_SUPPLIER',
            sucessMessage: 'Proveedor enlazado correctamente'
        }

        this.props.dispatch(generalSave(kwargs))
        this.props.dispatch({type: "CLEAR_TO_LINK_SUPPLIER"})
    }

    render(){
        let root_class = "supplier-link-confirmation " + (this.props.show_confirmation ? "" : "sup-link-invisible")
        const sup = this.props.to_link_supplier
        const doc = this.props.document_data_selected
        if(doc ===null || sup === null){
            return ''
        }
        return <div className={root_class}>
            <div className="supplier-link-confirmation-body">
                <div className="supplier-link-confirmation-body-header">
                    <h1>Confirmar asociación de proveedor?</h1>
                    <br/>
                    <p>Desea vincular el proveedor seleccionado con el emisor de esta
                        factura electrónica? Está acción actualizara la identificación del proveedor,
                        su nombre y su correo electrónico.
                    </p>
                </div>

                <div id="linker-content">
                    <div className="supplier-link-confirmation-body-item">
                        <h2>Emisor de Factura</h2>
                        <div className="supplier-link-confirmation-body-item-prop">
                            <div className="supplier-link-confirmation-body-item-prop-label">
                                Nombre Comercial:
                            </div>
                            <div className="supplier-link-confirmation-body-item-prop-value">
                                {doc.emisor?doc.emisor.NombreComercial:''}
                            </div>
                        </div>
                        <div className="supplier-link-confirmation-body-item-prop">
                            <div className="supplier-link-confirmation-body-item-prop-label">
                                Nombre Legal:
                            </div>
                            <div className="supplier-link-confirmation-body-item-prop-value">
                                {doc.emisor.Nombre}
                            </div>
                        </div>
                        <div className="supplier-link-confirmation-body-item-prop">
                            <div className="supplier-link-confirmation-body-item-prop-label">
                                Identificación:
                            </div>
                            <div className="supplier-link-confirmation-body-item-prop-value">
                                { doc.emisor.Tipo + " - " + doc.emisor.Numero}
                            </div>
                        </div>
                    </div>
                    
                    <div className="supplier-link-confirmation-body-item" id="arrows-holder">
                        <div>
                            <i className="fa fa-arrow-right fa-2x"></i>
                            <i className="fa fa-arrow-right fa-2x"></i>
                            <i className="fa fa-arrow-right fa-2x"></i>
                        </div>
                    </div>
                    
                    <div className="supplier-link-confirmation-body-item">
                        <h2>Proveedor Seleccionado</h2>
                        <div className="supplier-link-confirmation-body-item-prop">
                            <div className="supplier-link-confirmation-body-item-prop-label">
                                Código/Nombre:
                            </div>
                            <div className="supplier-link-confirmation-body-item-prop-value">
                                {sup.code + "-" + sup.name}
                            </div>
                        </div>
                        <div className="supplier-link-confirmation-body-item-prop">
                            <div className="supplier-link-confirmation-body-item-prop-label">
                                Correo electrónico:
                            </div>
                            <div className="supplier-link-confirmation-body-item-prop-value">
                                {sup.email!==""?sup.email:"No registrado"}
                            </div>
                        </div>
                    </div>
                    
                </div>

                <div className="supplier-link-confirmation-body-footer">
                    <div id="linker-buttons-holder">
                        <button
                            className="linker-button" 
                            onClick={this.performLinking.bind(this)}
                            id="perform_linking">
                                Aceptar
                        </button>
                        <button
                            className="linker-button" 
                            onClick={this.abortLinking.bind(this)}
                            id="cancel_linking">
                                Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}