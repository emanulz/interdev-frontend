import React from 'react'
import {connect} from 'react-redux'

import {generalSave} from '../../../../utils/api.js'


@connect(store=>{
    return {
        show_confirmation: store.smart_purchase.show_prod_link_confirmation,
        //product selected in the XML to be linked
        to_link_product: store.smart_purchase.product_to_link,
        //internal code that the user is claiming its the equivalent to the selected XML
        internal_product_to_link: store.smart_purchase.internal_product_to_link,
        //XML invoice being linked
        invoice_to_link: store.smart_purchase.invoice_to_link,
        
    }
})
export default class ProductLinkerConfirmation extends React.Component {


    performProdLinking(){

        //this.props.dispatch({type: "TOGGLE_PROD_LINK_CONFIRMATION"})
        // console.log("Prod linking invoice --> ", this.props.invoice_to_link)
        // console.log("Prod linking to link prod --> ", this.props.to_link_product)
        // console.log("Internal prod to link --> ", this.props.internal_product_to_link)
        let xml_code = null;
        if(this.props.to_link_product.CodigosMeta.length>0){
            xml_code = `${this.props.to_link_product.CodigosMeta[0].type}-${this.props.to_link_product.CodigosMeta[0].code}`
        }
        

        const linking_data = {
            supplier_id: this.props.invoice_to_link.proveedor.id,
            target_prod_id: this.props.internal_product_to_link.id,
            sup_code: xml_code,
            sup_description: this.props.to_link_product.Detalle
        }
        const kwargs = {
            url: '/api/suppliers/linkProduct/',
            method: 'post',
            data: linking_data,
            successType: 'PRODUCT_LINKED',
            errorType: 'ERROR_LINKING_PRODUCT',
            sucessMessage: 'Producto enlazado correctamente.'

        }
        console.log("Prod Linking final kwargs --> ", kwargs)
        //dispatch the creation of the record with the link
        this.props.dispatch(generalSave(kwargs))
        this.props.dispatch({type: "CLEAR_TO_LINK_INTERNAL_PRODUCT"})
    }

    abortProdLinking(){
        this.props.dispatch({type: 'TOGGLE_PROD_LINK_CONFIRMATION'})
        this.props.dispatch({type: 'CLEAR_TO_LINK_INTERNAL_PRODUCT'})
    }

    render(){
        let root_class = "product-link-confirmation " + (this.props.show_confirmation ? "" : "prod-link-invisible")
        console.log("Show product linker conf --> ", this.props.show_confirmation)
        const prod_xml = this.props.to_link_product
        const prod_intern = this.props.internal_product_to_link
        console.log("Prod xml --> ", prod_xml)
        console.log("Internal prod --> ", prod_intern)
        if(prod_xml ===null || prod_intern === null){
            return ''
        }

        let xml_code = "Sin definir"
        if(prod_xml.CodigosMeta.length>0){
            xml_code = `Tipo: ${prod_xml.CodigosMeta[0].type} - Código: ${prod_xml.CodigosMeta[0].code}`
        }

        return <div className={root_class}>
            <div className="product-link-confirmation-body">
                <div className="product-link-confirmation-body-header">
                    <h1>Confirmar asociación de producto?</h1>
                    <br/>
                    <p>Desea vincular el producto seleccionado en el XML con el producto existente en el sistema? 
                        Está acción ajustará el código de impuesto, valor del impuesto y código de proveedor del 
                        código actual.
                    </p>
                </div>

                <div id="linker-content">
                    <div className="product-link-confirmation-body-item">
                        <h2>Producto en XML</h2>
                        <div className="product-link-confirmation-body-item-prop">
                            <div className="product-link-confirmation-body-item-prop-label">
                                Código Proveedor:
                            </div>
                            <div className="product-link-confirmation-body-item-prop-value">
                                {xml_code}
                            </div>
                        </div>
                        <div className="product-link-confirmation-body-item-prop">
                            <div className="product-link-confirmation-body-item-prop-label">
                                Detalle:
                            </div>
                            <div className="product-link-confirmation-body-item-prop-value">
                                {prod_xml.Detalle}
                            </div>
                        </div>
                        {/* <div className="product-link-confirmation-body-item-prop">
                            <div className="product-link-confirmation-body-item-prop-label">
                                Identificación:
                            </div>
                            <div className="product-link-confirmation-body-item-prop-value">
                                { "doc.emisor.Tipo + " - " + doc.emisor.Numero"}
                            </div>
                        </div> */}
                    </div>
                    
                    <div className="product-link-confirmation-body-item" id="arrows-holder">
                        <div>
                            <i className="fa fa-arrow-right fa-2x"></i>
                            <i className="fa fa-arrow-right fa-2x"></i>
                            <i className="fa fa-arrow-right fa-2x"></i>
                        </div>
                    </div>
                    
                    <div className="product-link-confirmation-body-item">
                        <h2>Producto Interno</h2>
                        <div className="product-link-confirmation-body-item-prop">
                            <div className="product-link-confirmation-body-item-prop-label">
                                Código:
                            </div>
                            <div className="product-link-confirmation-body-item-prop-value">
                                {prod_intern.code}
                            </div>
                        </div>
                        <div className="product-link-confirmation-body-item-prop">
                            <div className="product-link-confirmation-body-item-prop-label">
                                Descripción:
                            </div>
                            <div className="product-link-confirmation-body-item-prop-value">
                                {prod_intern.description}
                            </div>
                        </div>
                    </div>
                    
                </div>

                <div className="product-link-confirmation-body-footer">
                    <div id="linker-buttons-holder">
                        <button
                            className="linker-button" 
                            onClick={this.performProdLinking.bind(this)}
                            id="perform_linking">
                                Aceptar
                        </button>
                        <button
                            className="linker-button" 
                            onClick={this.abortProdLinking.bind(this)}
                            id="cancel_linking">
                                Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}