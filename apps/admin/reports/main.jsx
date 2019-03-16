import React from 'react'
import {connect} from 'react-redux'
import PurchasesVrsSales from './reports/sales_vrs_purchases.jsx'
import ExcelFetcher from './reports/excel_downloader.jsx'
import { getItemDispatch } from '../../../utils/api'

@connect(store=>{
    return {
        selected_section: store.generalReports.selected_section
    }
})
export default class GeneralReports extends React.Component {

    componentWillMount(){
    // Fetch the elements of the Departments model and dispatch to reducer
    // *******************************************************************
    const productDepartmentKwargs = {
        url: '/api/productdepartments/?limit=300',
        successType: 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED',
        errorType: 'FETCH_PRODUCT_DEPARTMENTS_REJECTED'
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(getItemDispatch(productDepartmentKwargs))
    }

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