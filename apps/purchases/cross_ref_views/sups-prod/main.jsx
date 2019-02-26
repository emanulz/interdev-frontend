import React from 'react'
import {connect} from 'react-redux'
import {getSingleItemDispatch} from '../../../../utils/api.js'
import General_Chart from '../general_chart/main.jsx'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'

@connect(store=>{
    return {
        records_limit: store.cross_ref.cross_actions.records_limit,
        records_to_fetch: store.cross_ref.cross_actions.records_to_fetch,
        supplier_code: store.cross_ref.cross_actions.supplier_code,
        last_year_insights: store.cross_ref.cross_actions.last_year_insights,
        start_date: store.cross_ref.cross_actions.start_date,
        end_date: store.cross_ref.cross_actions.end_date,
        supplier_insight: store.cross_ref.cross_actions.supplier_insight,
    }
})
export default class Sups_Prod extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            per_month_is_table: true, //the date for per month is displayed as a table
            per_month_chart_type: 'bar',


        }
    }

    fetchSupplierInsight(e){
        if(this.props.supplier_code ===''){
            this.props.dispatch({type: 'SUPPLIER_CODE_NOT_SET'})
            return
        }
        let url = `/api/cross_reference/getSupplierInsight/?supplier_code=${this.props.supplier_code}`
        if(this.props.last_year_insights){
            url = `${url}&last_year=true`
        }else{
            if(this.props.start_date==='' || this.props.end_date===''){
                this.props.dispatch({type: 'CROSS_DATE_NOT_SET'})
                return
            }
            const start_date_object = new Date(this.props.start_date)
            const end_date_object = new Date(this.props.end_date)
            if(start_date_object > end_date_object){
                this.props.dispatch({type: 'CROSS_DATE_UNORDERED'})
                return
            }

            url = `${url}&start_date=${this.props.start_date}&end_date=${this.props.end_date}`
        }
        const kwargs = {
            url: url,
            successType: 'SUPPLIER_INSIGHT_SUCCESS',
            errorType: 'SUPPLIER_INSIGHT_REJECTED',

        }

        this.props.dispatch(getSingleItemDispatch(kwargs))
    }



    setFilters(source, e){
        switch(source){
            case 'supplier_code':
            {
                this.props.dispatch({type:'SET_SUPPLIER_CODE', payload: e.target.value})
                break
            }
            case 'records_limit':
            {
                const new_limit = parseInt(e.target.value)
                if (isNaN(new_limit)){
                    this.props.dispatch({type:'IS_NAN', payload: e.target.value})
                    return
                }

                if(new_limit>this.props.records_limit){
                    this.props.dispatch({type:'TOO_MANY_RECORDS', payload: new_limit})
                }

                this.props.dispatch({type:'SET_RECORDS_TO_FECTH', payload: new_limit})
                
                break
            }
            case 'start_date':
            {
                console.log("Start date event ", e.target.value)
                this.props.dispatch({type: 'SET_CROSS_START_DATE', payload: e.target.value})
                break
            }
            case 'end_date':
            {
                console.log("End date event ", e.target.value)
                this.props.dispatch({type: 'SET_CROSS_END_DATE', payload: e.target.value})
                break
            }
            case 'last_year_insights':
            {
                this.props.dispatch({type: 'TOGGLE_LAST_YEAR_FLAG', payload: e.target.value})
                break
            }
            default:
            {
                console.log("Action not supported")
            }
        }
    }


    togglePerMonthMoneyDisplay(){
        this.setState({
            per_month_is_table: !this.state.per_month_is_table
        })
    }

    buildPerMonthMoneyChartOrTable(){
        if(this.props.supplier_insight==null){
            return ''
        }
        
        if(this.state.per_month_is_table){
            const header = [
                {
                    field: 'month',
                    text: 'Periódo'
                },
                {
                    field: 'total_money',
                    text: 'Monto',
                    type: 'price'
                },
                {
                    field: 'purchases_count',
                    text: 'Facturas'
                }
            ]
            const keys = Object.keys(this.props.supplier_insight.per_month_money)
            console.log("KEYS --> ", keys)
            const data = keys.map(key=>{
                let target = this.props.supplier_insight.per_month_money[key]
                return {
                    month: key,
                    total_money: target.total_money,
                    purchases_count: target.month_purchases.length
                }
            })
            console.log("Building a table")
            return {
                header: header,
                data: data
            }
        }else{
            console.log("Build a chart of type: ", this.state.per_month_chart_type)
        }
    }

    openPurchaseInNewWindow(bound){
        window.open(`/purchases/purchase/${bound}`)
    }

    exploreNumericKey(key){
        let data = {
            consecutivo: '',
            fecha_emision: '',
            emisor: '',

        }
        if(key.length ===50){
            
            data = {
                consecutivo: `${key.substring(21, 41)}`,
                fecha_emision: `${key.substring(3,5)}-${key.substring(5,7)}-${key.substring(7,9)}`,
                emisor: `${key.substring(9, 21)}`,
    
            }
            const type_code = data['consecutivo'].substring(8,10)

            let type_string = ''
            switch(type_code){
                case '01':
                {
                    type_string = "FE"
                    break
                }
                case '02':
                {
                    type_string = "NC"
                    break
                }
                case '03':
                {
                    type_string = "ND"
                    break
                }
                case '05':
                {
                    type_string = "TE"
                    break
                }
            }
            data['doc_type'] = type_string
        }
        return data
    }

    buildPurchasesListTable(){
        if(this.props.supplier_insight==null){
            return ''
        }
        const header = [
            {
                field: 'consecutive',
                text: 'Consecutivo',
                onClickFunction: this.openPurchaseInNewWindow,
                type: 'function_on_click'
            },
            {
                field: 'consecutive_hacienda',
                text: 'Consecutivo',
            },
            {
                field: 'money',
                text: 'Monto Factura',
                type: 'price'
            },
            {
                field: 'balance',
                text: 'Pendiente Pago',
                type: 'price'
            },
            {
                field: 'warehouse_name',
                text: 'Bodega Ingreso',
            },
            {
                field: 'purchase_type',
                text: 'Tipo Pago',
            },
            {
                field: 'doc_type',
                text: 'Tipo Comprobante'
            }

        ]

        const data = this.props.supplier_insight.individual_purchases.map(pur=>{
            const explore_key = this.exploreNumericKey(pur.numeric_key)
            return {
                consecutive: pur.consecutive,
                consecutive_hacienda: explore_key.consecutivo,
                money: pur.money,
                balance: pur.balance,
                warehouse_name: pur.warehouse.name,
                purchase_type: pur.purchase_type,
                doc_type: explore_key.doc_type

            }
        })
        return {
            header: header,
            data: data
        }

    }


    render(){

        let total_sup_purchases = ''
        if(this.props.supplier_insight !== null){
            total_sup_purchases = <div id="total-sup-money-container">
                <div>₡{this.props.supplier_insight.total_purchase_money.formatMoney(2, ',', '.')}</div>
            </div>
        }

        //build the data for the per month sales
        const per_month_data = this.buildPerMonthMoneyChartOrTable()
        let per_month_display = ''

        const purchases_list_table_data =this.buildPurchasesListTable()
        let purchases_list_table = ''

        if(this.props.supplier_insight != null){
            if(this.state.per_month_is_table){
                per_month_display = <AdminTable headerOrder={per_month_data.header}
                    data={per_month_data.data} />
            }else{
                per_month_display = <General_Chart/>
            }
            
            purchases_list_table = <AdminTable headerOrder={purchases_list_table_data.header}
            data={purchases_list_table_data.data} />

        }


        return <div >
            <div className='cross-header'>
                <h1>Referencia de Proveedor</h1>
                <label>Código proveedor</label>
                <input name='supplier-code' onChange={this.setFilters.bind(this, 'supplier_code')}
                value={this.props.supplier_code}
                type='text' className='form-control' 
                />

                <label>Cantidad registros</label>
                <input name='product-code' onChange={this.setFilters.bind(this, 'records_limit')}
                type='text' className='form-control'
                value={this.props.records_to_fetch} 
                 />
                <div className="date-input">
                    <label htmlFor="start-date">Fecha Inicial:</label>
                    <input type="date" name="start-date" 
                        onChange={this.setFilters.bind(this, 'start_date')}
                        value={this.props.start_date}/>
                </div>

                <div className="date-input">
                    <label htmlFor="end-date">Fecha Final:</label>
                    <input type="date" name="end-date"
                        onChange={this.setFilters.bind(this, 'end_date')}
                        value={this.props.end_date}/>
                </div>

                <label>Recuperar último año</label>
                <input checked={this.props.last_year_insights} name='last_year_insights'
                    onChange={this.setFilters.bind(this, 'last_year_insights')}
                    type='checkbox' className='form-control' />

                <button onClick={this.fetchSupplierInsight.bind(this, false)}
                className='form-control btn-primary'>
                    Obtener Datos
                </button>

            </div>
            
            <div className="cross-zone zone-1">
                <div className="cross-zone-title">
                    <h1>Compras totales a este proveedor</h1>
                    <p>No refleja notas de crédito</p>
                    <div id="total-sup-money-container">
                        {total_sup_purchases}
                    </div>
                </div>

            </div>
            <div className="cross-zone zone-2">
                <div className="cross-zone-title">
                    <h1>Compras por Mes</h1>
                    <p>No refleja notas de crédito</p>
                    <button onClick={this.togglePerMonthMoneyDisplay.bind(this)}
                        className='form-control btn-primary'>
                            {this.state.per_month_is_table? 'Mostrar Gráfico': 'Mostrar Tabla'}
                        </button>
                </div>
                <div className="cross-zone-per-month-container">
                    {per_month_display}
                </div>
                
            </div>

            <div className="cross-zone zone-3"> 

                <div className="cross-zone-title">
                    <h1>Detalle de Facturas</h1>
                </div>

                <div className="cross-zone-purchases-detail">
                    {purchases_list_table}
                </div>

            </div>

        </div>
    }
}