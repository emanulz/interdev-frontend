import React from 'react'
import {connect} from 'react-redux'


@connect(store=>{
    return {
        documents_data: store.smart_purchase.documents_data,
        document_data_selected: store.smart_purchase.document_data_selected
    }
})
export default class Doc_Summary extends React.Component {


    componentWillMount(){

    }

    render(){
        const data = this.props.document_data_selected
        if(this.props.document_data_selected === null){
            if(this.props.documents_data.length > 0){
                return <div className="doc-summary">
                    <h1 className="section_header">Resumen factura seleccionada</h1>
                    <hr/>
                    <div className="pending-load">
                        <h2>Por favor seleccione un documento de la lista de archivos.</h2>
                    </div>
                    
                </div>
            }else{
                return <div className="doc-summary">
                    <h1 className="section_header">Resumen factura seleccionada</h1>
                    <hr/>
                    <div className="pending-load">
                        <h2>Aún no se han procesado los archivos.</h2> 
                    </div>
                </div>
            }

        }

        return <div className="doc-summary">

            <h1 className="section_header">Información General del Documento</h1>
            <hr/>
            <div className="doc-summary-section">
                <h2>Información Emisor</h2>
                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Nombre Comercial:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.emisor.NombreComercial ? data.emisor.NombreComercial : ''}
                    </div>
                </div>

                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Nombre legal:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.emisor.Nombre}
                    </div>
                </div>
                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Identificación:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.emisor.Numero}
                    </div>
                </div>
                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Teléfono:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.emisor.Telefono ? data.emisor.Telefono : 'Desconocido'}
                    </div>
                </div>

            </div>

            <div className="doc-summary-section">
                <h2>Información Receptor</h2>
                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Nombre Comercial:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.receptor.NombreComercial ? data.receptor.NombreComercial : ''}
                    </div>
                </div>
                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Nombre legal:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.receptor.Nombre}
                    </div>
                </div>
                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Número Identificación:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.receptor.Numero ? data.receptor.Numeor : "Desconocida"}
                    </div>
                </div>

            </div>

            <div className="doc-summary-section">
                <h2>Información Factura</h2>
                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Aceptada ante Hacienda:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.already_accepted ? data.already_accepted : "No"}
                    </div>
                </div>
                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Cargada inventario:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.already_loaded ? data.already_loaded : "No"}
                    </div>
                </div>
                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Moneda:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.summary.CodigoMoneda}
                    </div>
                </div>
                <div className="doc-summary-section-row"> 
                    <div className="doc-summary-section-row-legend">
                        Tipo de cambio:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.summary.TipoCambio}
                    </div>
                </div>

                <div className="doc-summary-section-row">
                    <div className="doc-summary-section-row-legend">
                        Total Comprobante:
                    </div>
                    <div className="doc-summary-section-row-value">
                        {data.summary.TotalComprobante}
                    </div>
                </div>


            </div>

        </div>
    }
}