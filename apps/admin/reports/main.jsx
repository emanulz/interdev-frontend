import React from 'react'
import { connect } from 'react-redux'
import PurchasesVrsSales from './reports/sales_vrs_purchases.jsx'
import ExcelFetcher from './reports/excel_downloader.jsx'
import { getItemDispatch } from '../../../utils/api'

@connect(store => {
  return {
    selected_section: store.generalReports.selected_section
  }
})
export default class GeneralReports extends React.Component {

  componentWillMount() {
    // Fetch the elements of the Departments model and dispatch to reducer
    // *******************************************************************
    const productDepartmentKwargs = {
      url: '/api/productdepartments/?limit=300',
      successType: 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_DEPARTMENTS_REJECTED'
    }
    const productSubDepartmentKwargs = {
      url: '/api/productsubdepartments/?limit=300',
      successType: 'FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED'
    }
    this.props.dispatch({ type: 'FETCHING_STARTED'})
    this.props.dispatch(getItemDispatch(productDepartmentKwargs))
    console.log("Get sub deps")
    this.props.dispatch(getItemDispatch(productSubDepartmentKwargs)) 
  }

  switchSection(section, e) {
    this.props.dispatch({ type: 'SET_SECTION', payload: section })
  }

  render() {

    const content = this.props.selected_section === 'downloadables' ? <ExcelFetcher /> : <PurchasesVrsSales />
    const downloadablesClass = this.props.selected_section === 'downloadables' ? 'form-control btn-default first' : 'form-control btn-primary first active'
    const salesReportClass = this.props.selected_section === 'purchases_sales' ? 'form-control btn-default second' : 'form-control btn-primary second active'

    return <div className='admin-reports' >
      <div className='admin-reports-header'>
        <button className={downloadablesClass} onClick={this.switchSection.bind(this, 'downloadables')}>
          Mostrar Reportes Descargables
        </button>
        <button className={salesReportClass} onClick={this.switchSection.bind(this, 'purchases_sales')}>
          Mostrar Reporte de Compras y Ventas
        </button>
      </div>
      {content}
    </div>
  }
}
