import React from 'react'
import {connect} from 'react-redux'
import {getSingleItemDispatch} from '../../../../utils/api.js'
import General_Chart from '../general_chart/main.jsx'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'

@connect(store=>{
    return {
        records_limit: store.cross_ref.cross_actions.records_limit,
        records_to_fetch: store.cross_ref.cross_actions.records_to_fetch,
        product_code: store.cross_ref.cross_actions.product_code,
        product_insight: store.cross_ref.cross_actions.product_insight,
    }
})
export default class Prices_Prod extends React.Component {
    

    fetchProductInsight(e){
        if(this.props.product_code ===''){
            this.props.dispatch({type: 'PRODUCT_CODE_NOT_SET'})
            return
        }
        const kwargs = {
            url: `/api/cross_reference/getProductInsight/?product_code=${this.props.product_code}&historic_purchase_count=${this.props.records_to_fetch}`,
            successType: 'PRODUCT_INSIGHT_SUCCESS',
            errorType: 'PRODUCT_INSIGHT_REJECTED',

        }

        this.props.dispatch(getSingleItemDispatch(kwargs))
    }

    setFilters(source, e){
        switch(source){
            case 'product_code':
            {
                this.props.dispatch({type:'SET_PRODUCT_CODE', payload: e.target.value})
                break
            }
            case 'records_limit':{
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
            default:
            {
                console.log("Action not supported")
            }
        }
    }


    buildPriceChart(){
        const data = this.props.product_insight
        if(data === null){
            return {}
        }
        const labels = data.price_series.cost.map(item=>{
            return item.date
        })

        //build all the price related data sets
        const cost_set_values = data.price_series.cost.map(item=>{
            return item.cost
        })

        const price1_set_values = data.price_series.price1.map(item=>{
            return item.price1
        })

        const price2_set_values = data.price_series.price2.map(item=>{
            return item.price2
        })

        const price3_set_values = data.price_series.price3.map(item=>{
            return item.price3
        })

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Costo',
                    data: cost_set_values
                },
                {
                    label: 'Precio 1',
                    data: price1_set_values
                },
                {
                    label: 'Precio 2',
                    data: price2_set_values
                },
                {
                    label: 'Precio 3',
                    data: price3_set_values
                }
            ]
        }
    }


    openSupplierInNewWindow(bound){
        window.open(`/admin/suppliers/edit/${bound}`)
    }

    openPurchaseInNewWindow(bound){
        window.open(`/purchases/purchase/${bound}`)
    }

    buildSuppliersTable(){
        if(this.props.product_insight==null){
            return ''
        }
        const header = [
            {
                field: 'code',
                text: 'Código',
                onClickFunction: this.openSupplierInNewWindow,
                type: 'function_on_click'
            },
            {
                field: 'name',
                text: 'Nombre',
                type: 'text'
            }, 
            {
                field: 'phone',
                text: 'Teléfono',
                type: 'text'
            },  
            {
                field: 'email',
                text: 'Código',
                type: 'text'
            },
            {
                field: 'last_purchase',
                text: 'Última compra',
                type: 'date'
            },
            {
                field: 'last_cost',
                text: 'Último costo',
                type: 'price'
            },

        ]

        //preprocess the table data
        const table_data = this.props.product_insight.suppliers.map(item=>{
            //find the last purchase made by this supplier
            const last_purchase = this.props.product_insight.price_series.cost.find(sup=>{
                return sup.supplier_id===item.id
            })
            return {
                code: item.code,
                email: item.email,
                id_num: item.id_num,
                id_type: item._id_type=="02"? 'JURÍDICA': 'FISICA',
                name: item.name,
                phone: item.phone,
                last_purchase: last_purchase ? last_purchase.raw_date: 'No definida',
                last_cost: last_purchase.cost ? last_purchase.cost : -1

            }
        })

        const table = <AdminTable headerOrder={header} data={table_data} app="admin" model="suppliers"/>

        return table
    }

    buildPurchasesTable(){
        if(this.props.product_insight==null){
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
                field: 'supplier_name',
                text: 'Proveedor',
                type: 'text'
            },
            {
                field: 'purchase_total',
                text: 'Monto compra',
                type: 'price'
            },
            {
                field: 'numeric_key',
                text: 'Consecutivo Hacienda',
                type: 'text'
            },
            {
                field: 'warehouse',
                text: 'Bodega de Ingreso',
                type: 'text'
            },
            {
                field: 'created',
                text: 'Fecha',
                type: 'date'
            },
        ]

        const table_data = this.props.product_insight.purchases_data.map(item=>{
            const supplier = this.props.product_insight.suppliers.find(sup=>{
                return sup.id === item.supplier_id
            })

            return {
                consecutive: item.consecutive,
                supplier_name: supplier ? supplier.name : 'No disponible',
                purchase_total: item.purchase_total,
                numeric_key: item.numeric_key===""? item.invoice_number: item.numeric_key,
                warehouse: item.warehouse.name,
                created: item.created
            }
        })

        const table = <AdminTable headerOrder={header} data={table_data}/>
        return table
    }

    render(){

        const prices_chart_data = this.buildPriceChart()
        const options = {
            title: "Historico de Costos y Precios",
            yAxisLegend: "Precio",
            xAxisLegend: "Fecha"
        }

        const sups_table = this.buildSuppliersTable()

        const purchases_table = this.buildPurchasesTable()

        return <div>
            <div className='cross-header'>
                <h1>Información de precios</h1>
                <label>Código producto</label>
                <input name='product-code' onChange={this.setFilters.bind(this, 'product_code')}
                value={this.props.product_code}
                type='text' className='form-control' 
                />
                
                <label>Cantidad registros</label>
                <input name='product-code' onChange={this.setFilters.bind(this, 'records_limit')}
                type='text' className='form-control'
                value={this.props.records_to_fetch} 
                 />
                <div className="cross-header-actions">


                </div>
                <button onClick={this.fetchProductInsight.bind(this, false)}
                className='form-control btn-primary'>
                    Obtener Datos
                </button>
            </div>
            <div className="cross-zone zone-1">
                <div className="cross-zone-title">
                    <h1>Historico de precios</h1>
                </div>
                <div className="cross-zone-content">
                    <General_Chart chart_data={prices_chart_data} options={options}/>
                </div>
                
            </div>

            <div className="cross-zone zone-2">
                <div className="cross-zone-title">
                    <h1>Proveedores de este Producto</h1>
                </div>
                <div className="cross-zone-content">
                    {sups_table}
                </div>
            </div>
            
            <div className="cross-zone- zone-3">
                <div className="cross-zone-title">
                    <h1>Compras de este Producto</h1>
                </div>
                <div className="cross-zone-content">
                    {purchases_table}
                </div>
                
            </div>
        </div>
    }
}