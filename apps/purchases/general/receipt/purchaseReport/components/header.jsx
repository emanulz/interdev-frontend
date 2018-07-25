import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return {
        supplier: store.suppliers.supplierSelected,
        purchase: store.purchase,
        warehouse: store.warehouses.selectedWarehouse,
        company: store.config.company,
    }
})
export default class Header  extends React.Component {
    render(){

        const headerText = "Reporte para impresión de etiquetas"
        const headerName = this.props.company.comercial_name || 'Nombre de la Empresa'


        return <div>

            <div className="report-header">
                <h1>{headerName}</h1>
                <h2>{headerText}</h2>
                <hr/>
            </div>

        </div>
    }
}