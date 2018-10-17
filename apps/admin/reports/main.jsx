import React from 'react'
import {connect} from 'react-redux'
import PurchasesVrsSales from './reports/sales_vrs_purchases.jsx'
import ExcelFetcher from './reports/excel_downloader.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'

@connect(store=>{
    return {
        selected_section: store.generalReports.selected_section
    }
})
export default class GeneralReports extends React.Component {

    switchSection(section, e){
        this.props.dispatch({type:'SET_SECTION', payload: section})
    }

    render(){
        
        const content = this.props.selected_section ==="downloadables" ? <ExcelFetcher /> : <PurchasesVrsSales />
        
       return <div>
            <button className="form-control btn-primary"  onClick={this.switchSection.bind(this, "purchases_sales")}>
                Mostrar Reporte de Compras y Ventas
            </button>
            <button className="form-control btn-primary"  onClick={this.switchSection.bind(this, "downloadables")}>
                Mostrar Reportes Descargables
            </button>
            {content}
       </div>
    }
}