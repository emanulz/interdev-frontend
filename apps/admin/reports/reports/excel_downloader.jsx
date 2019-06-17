import React from 'react'
import { connect } from 'react-redux'
// import { getSingleItemDispatch, getItemReturn } from '../../../../utils/api.js'
import alertify from 'alertifyjs'
import Select2 from 'react-select2-wrapper'

@connect(store => {
  return {
    start_date: store.generalReports.start_date,
    end_date: store.generalReports.end_date,
    installedApps: store.config.installed_apps,
    useReserves: store.config.globalConf.useReserves,
    useLegacyd151: store.config.globalConf.useLegacyd151,
    departments: store.generalReports.departments,
    selectedDepartment: store.generalReports.selectedDepartment
  }
})
export default class ExcelFetcher extends React.Component {

  componentWillMount() {
    const now = new Date()
    const month_first = new Date(now.getFullYear(), now.getMonth(), 1).getDate()
    const month_last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    // http://dante/api/reporting/getReportVisualizationData/?report=salesvrspurchases&start=2018-06-1&end=2018-06-30

    this.props.dispatch({ type: 'SET_START_DATE', payload: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${month_first.toString().padStart(2, '0')}` })
    this.props.dispatch({ type: 'SET_END_DATE', payload: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${month_last.toString().padStart(2, '0')}` })
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
    if (this.props.useLegacyd151) {
      legacy_d151 = <a href={`/reportsExcel/d151legacy/?start=${s}&end=${e}&money_limit=250`}>D151 Legado</a>
    }

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
        <a href={`/reportsExcel/generalsales/?start=${s}&end=${e}`}>General Ventas</a>
        <a href={`/reportsExcel/generalpurchases/?start=${s}&end=${e}`}>General Compras</a>
        <a href={`/reportsExcel/clientscatalog`}>Catálogo Clientes</a>
        <a href='/reportsExcel/productscatalog'>Lista de Precios</a>
        <a href={`/reportsExcel/d151/?start=${s}&end=${e}&money_limit=250`}>D151</a>
        {inventoryValue}
        {creditsReport}
        {toPayReport}
        {legacy_d151}
        {rest_report}
        {bd_report}
        {reserves}
      </div>
      <div className='excel-fetcher-byfamily'>
        {utilityByFamily}
        {inventoriesByFamily}
      </div>
    </div>
  }
}
