import React from 'react'
import { connect } from 'react-redux'
// import { getSingleItemDispatch, getItemReturn } from '../../../../utils/api.js'
import alertify from 'alertifyjs'
import Select2 from 'react-select2-wrapper'
import {getItemDispatch } from '../../../../utils/api.js'
import D151 from './d151_downloader.jsx'
import PerClient from './per_client_sales.jsx'

@connect(store => {
  return {
    start_date: store.generalReports.start_date,
    end_date: store.generalReports.end_date,
    installedApps: store.config.installed_apps,
    useReserves: store.config.globalConf.useReserves,
    isTrinche: store.config.globalConf.isTrincheras,
    useLegacyd151: store.config.globalConf.useLegacyd151,
    departments: store.generalReports.departments,
    selectedDepartment: store.generalReports.selectedDepartment,
    warehouses: store.generalReports.warehouses,
    selectedWarehouse: store.generalReports.selectedWarehouse,
  }
})
export default class ExcelFetcher extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      d151_limit: 2500000,
      d151_client: '',
      per_client_client: '',
    };
  }

  onD151LimitChange = (event) => {
    let limit = event.target.value
    if(isNaN(limit)){
      limit = 0
    }
    this.setState({
      d151_limit: limit
    })
  }

  onD151ClientChange = (event) => {
    let new_val = event.target.value
    if(!new_val){
      new_val = ''
    }
    this.setState({
      d151_client: new_val
    })
  }

  onPerClientSalesChange = (event) => {
    let client = event.target.value
    this.setState({
      per_client_client: client
    })
  }

  componentWillMount() {
    const now = new Date()
    const month_first = new Date(now.getFullYear(), now.getMonth(), 1).getDate()
    const month_last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    // http://dante/api/reporting/getReportVisualizationData/?report=salesvrspurchases&start=2018-06-1&end=2018-06-30

    this.props.dispatch({ type: 'SET_START_DATE', payload: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${month_first.toString().padStart(2, '0')}` })
    this.props.dispatch({ type: 'SET_END_DATE', payload: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${month_last.toString().padStart(2, '0')}` })

    //obtain the warehouses
    const warehouses_dispatch = {
      url: '/api/warehouses/',
      successType: 'REPORTS_WAREHOUSES_SUCCEDED',
      errorType: 'REPORTS_WAREHOUSES_REJECTED',
    }
    this.props.dispatch(getItemDispatch(warehouses_dispatch));
  }

  onStartDateChange(e) {
    let start = new Date(e.target.value)
    let end = new Date(this.props.end_date)
    start = new Date(start.getTime() + start.getTimezoneOffset() * 60000)
    end = new Date(end.getTime() + end.getTimezoneOffset() * 60000)

    if (start > end) {
      alertify.alert('ERROR', `La fecha inicial no puede ser posterior a la final`)
      return
    }

    if (isNaN(start.getTime())) {
      alertify.alert('ERROR', `Por favor use el selector de fecha y seleccione una fecha válida`)
      return
    }

    this.props.dispatch({ type: 'SET_START_DATE', payload: e.target.value })
  }

  onEndDateChange(e) {
    let start = new Date(this.props.start_date)
    let end = new Date(e.target.value)
    start = new Date(start.getTime() + start.getTimezoneOffset() * 60000)
    end = new Date(end.getTime() + end.getTimezoneOffset() * 60000)

    if (start > end) {
      alertify.alert('ERROR', `La fecha Final no puede ser anerior a la Inicial`)
      return
    }

    if (isNaN(end.getTime())) {
      alertify.alert('ERROR', `Por favor use el selector de fecha y seleccione una fecha válida`)
      return
    }
    this.props.dispatch({ type: 'SET_END_DATE', payload: e.target.value })
  }

  getReportStartEnd(report, e) {

    // check if the start date is smaller than the end date
    // if (this.props.start_date === '' || this.props.end_date === '') {
    //   alertify.alert('ERROR', `Se deben seleccionar ambas fechas`)
    //   return
    // }
    let start = new Date(this.props.start_date)
    let end = new Date(this.props.end_date)
    start = new Date(start.getTime() + start.getTimezoneOffset() * 60000)
    end = new Date(end.getTime() + end.getTimezoneOffset() * 60000)

    // if (start > end) {
    //   alertify.alert('ERROR', `La fecha inicial no puede ser posterior a la final`)
    //   return
    // }
    const s_date = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`
    const e_date = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
    return [s_date, e_date]

  }

  onFamilySelected(e) {
    if (e.target.value == '0000') {
      return // just the case where there are no families or was released on the default starting option
    }
    const target_date = this.getReportStartEnd()
    const start = target_date[0]
    const end = target_date[1]

    const url = `/reportsExcel/utilitiesfamily/?start=${start}&end=${end}&department=${e.target.value}`
    window.location.href = url
  }

  onFamilySelectedInventory(e) {
    if (e.target.value == '0000') {
      return // just the case where there are no families or was released on the default starting option
    }

    const url = `/reportsExcel/invvalue/?department=${e.target.value}`
    window.location.href = url
  }

  onWarehouseSelectedInventory(e) {
    if (e.target.value == '0000') {
      return // just the case where there are no families or was released on the default starting option
    }

    const url = `/reportsExcel/invvalue/?warehouses=${e.target.value}`
    window.location.href = url
  }

  buildFamilyUtilityRequester() {

    const departmentData = this.props.departments.map(department => {
      return { text: `${department.identifier} - ${department.name}`, id: `${department.id}` }
    })

    return <div className='excel-fetcher-utility'>
      <div className='excel-fetcher-utility-family'>
        <div className='excel-fetcher-utility-family-label'>
          Seleccione la familia:
        </div>
        <div className='excel-fetcher-utility-family-label'>
          <Select2
            name='department'
            value={this.props.selectedDepartment}
            className='form-control'
            onSelect={this.onFamilySelected.bind(this)}
            data={departmentData}
            options={{
              placeholder: 'Elija una Familia...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>
      </div>
    </div>
  }

  buildFamilyinventoryRequester() {

    const departmentData = this.props.departments.map(department => {
      return { text: `${department.identifier} - ${department.name}`, id: `${department.id}` }
    })

    return <div className='excel-fetcher-utility'>
      <div className='excel-fetcher-utility-family'>
        <div className='excel-fetcher-utility-family-label'>
          Seleccione la familia:
        </div>
        <div className='excel-fetcher-utility-family-select'>
          <Select2
            name='department'
            value={this.props.selectedDepartment}
            className='form-control'
            onSelect={this.onFamilySelectedInventory.bind(this)}
            data={departmentData}
            options={{
              placeholder: 'Elija una Familia...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>
      </div>
    </div>
  }

  buildWarehouseInventory() {

    const warehouseData = this.props.warehouses.map(warehouse => {
      return { text: `${warehouse.code} - ${warehouse.name}`, id: `${warehouse.id}` }
    })

    return <div className='excel-fetcher-utility'>
      <div className='excel-fetcher-utility-family'>
        <div className='excel-fetcher-utility-family-label'>
          Seleccione la bodega:
        </div>
        <div className='excel-fetcher-utility-family-select'>
          <Select2
            name='warehouse'
            value={this.props.selectedWarehouse}
            className='form-control'
            onSelect={this.onWarehouseSelectedInventory.bind(this)}
            data={warehouseData}
            options={{
              placeholder: 'Elija una Bodega...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>
      </div>
    </div>
  }


  render() {

    const target_date = this.getReportStartEnd()
    const s = target_date.length ? target_date[0] : ''
    const e = target_date.length ? target_date[1] : ''

    let rest_report = ''
    if (this.props.installedApps.RestaurantAppInstalled) {
      rest_report = <a href={`/reportsExcel/restservicereport/?start=${s}&end=${e}`}>Servicio Restaurante</a>
    }

    let bd_report = ''
    if (this.props.installedApps.WorkshopAppInstalled) {
      bd_report = <a href={`/reportsExcel/bdwarranty/?start=${s}&end=${e}`}>{'Garantías B&D'}</a>
    }

    let legacy_d151 = ''
    // if (this.props.useLegacyd151) {
    //   legacy_d151 = <a href={`/reportsExcel/d151legacy/?start=${s}&end=${e}&money_limit=250`}>D151 Legado</a>
    // }

    let reserves = ''
    if (this.props.useReserves) {
      reserves = <a href={`/reportsExcel/reservesdestroyed/?start=${s}&end=${e}`}>Reservas Descartadas</a>
    }

    let inventoryValue = ''
    if (this.props.installedApps.InventoriesAppInstalled) {
      inventoryValue = <a href='/reportsExcel/invvalue'>Valoración Inventario</a>
    }

    let creditsReport = ''
    if (this.props.installedApps.CreditsAppInstalled) {
      creditsReport = <a href={`/reportsExcel/creditstatus`}>General Crédito</a>
    }
    let toPayReport = ''
    if (this.props.installedApps.PurchaseAppInstalled) {
      toPayReport = <a href={`/reportsExcel/topayreport`}>Por Pagar</a>
    }

    let utilityByFamily = ''
    if (this.props.installedApps.PurchaseAppInstalled) {
      utilityByFamily = <div className='excel-fetcher-byfamily-item first'>
        <div className='excel-fetcher-title'>
          <h1>Reporte de Utilidad Por Familia</h1>
        </div>
        {this.buildFamilyUtilityRequester()}
      </div>
    }

    let inventoriesByFamily = ''
    if (this.props.installedApps.InventoriesAppInstalled) {
      inventoriesByFamily = <div className='excel-fetcher-byfamily-item second'>
        <div className='excel-fetcher-title'>
          <h1>Reporte de Existencias Por Familia</h1>
        </div>
        {this.buildFamilyinventoryRequester()}
      </div>
    }

    let inventoriesValueByFamily = ''
    if (this.props.installedApps.InventoriesAppInstalled) {
      inventoriesValueByFamily = <div className='excel-fetcher-byfamily-item second'>
        <div className='excel-fetcher-title'>
          <h1>Valoración Por Bodega</h1>
        </div>
        {this.buildWarehouseInventory()}
      </div>
    }


    let trincheReport1 = ''
    if(this.props.isTrinche){
      trincheReport1 = <a href={`/reportsExcel/trinchesalesinsight/?start=${s}&end=${e}`}>Trincheras</a>
    }

    return <div className='excel-fetcher' >
      <div className='excel-fetcher-title'>
        <h1>Seleccione el período a reportar y descarge el reporte en formato Excel</h1>
      </div>
      <div className='excel-fetcher-dates'>
        <div className='excel-fetcher-dates-item'>
          <label htmlFor='start-date'>Fecha Inicial:</label>
          <input type='date' name='start-date'
            onChange={this.onStartDateChange.bind(this)}
            value={this.props.start_date} />
        </div>

        <div className='excel-fetcher-dates-item'>
          <label htmlFor='end-date'>Fecha Final:</label>
          <input type='date' name='end-date'
            onChange={this.onEndDateChange.bind(this)}
            value={this.props.end_date} />
        </div>
      </div>

      <div className='excel-fetcher-reports'>
        {/* <a href={`/reportsExcel/cashregister/?start=${s}&end=${e}`}>Cierre de Caja</a> */}
        <a href={`/reportsExcel/generalsales/?start=${s}&end=${e}`}>General Ventas IVA</a>
        <a href={`/reportsExcel/generalpurchases/?start=${s}&end=${e}`}>General Compras IVA</a>
        {trincheReport1}
        <a href={`/reportsExcel/clientscatalog`}>Catálogo Clientes</a>
        <a href='/reportsExcel/productscatalog'>Lista de Precios</a>
        {inventoryValue}
        {creditsReport}
        {toPayReport}
        {legacy_d151}
        {rest_report}
        {bd_report}
        {reserves}
        <a href={`/reportsExcel/generalsaleslegacy/?start=${s}&end=${e}`}>General Ventas Antiguo</a>
        <a href={`/reportsExcel/generalpurchaseslegacy/?start=${s}&end=${e}`}>General Compras Antiguo</a>
      </div>
      <div className='excel-fetcher-byfamily'>
        {utilityByFamily}
        {inventoriesByFamily}
        {inventoriesValueByFamily}
      </div>
      <div className="detail-reports-container">
        <D151 
          start={s} end={e} limit={this.state.d151_limit} 
          client={this.state.d151_client}
          clientChange={this.onD151ClientChange}
          onLimitChange={this.onD151LimitChange}>
        </D151>

        <PerClient 
          start={s} end={e} clientChange={this.onPerClientSalesChange} 
          client={this.state.per_client_client}>
        </PerClient>
      </div>
    </div>
  }
}
