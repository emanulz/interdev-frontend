import React from 'react'
import {connect} from 'react-redux'
//import {getProviderDuePayments} from '../../general/actions.js'
import {setItem, getSingleItemDispatch} from '../../../../utils/api.js'
import {Link} from 'react-router-dom'
let inspect = require('util-inspect')

@connect(store=>{
    return {
        activeSupplier: store.suppliers.activeSupplier,
        supplierActivePurchasesWithDebt: store.unpaidPurchases.supplierActivePurchasesWithDebt
    }
})
export default class UnpaidPurchases extends React.Component {

    componentWillMount(){
        this.props.dispatch({type:'CLEAR_ACTIVE_SUPPLIER'})
        const lookUp = this.props.location.pathname.split('/').pop()

        const kwargs = {
            url:`/api/supplierscustom/${lookUp}`,
            successType: 'SET_SUPPLIER_AND_PURCHASES',
            errorType: 'SUPPLIER_NOT_FOUND',
        }

        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch(getSingleItemDispatch(kwargs))
    }

    componentWillReceiveProps(nextprops) {
        // if(nextprops.activeSupplier.id != '00000000-0000-0000-0000-000000000000' && 
        //     nextprops.activeSupplier.id != this.props.activeSupplier.id){
        //         console.log('Getting supplier due debt data')
        //         const id = nextprops.activeSupplier.id
        //         const kwargs = {
        //             supplier_id: id,
        //             successType: 'FETCH_SUPPLIER_PURCHASES_WITH_DEBT_FULFILLED',
        //             errorType: 'FETCH_SUPPLIER_PURCHASES_WITH_DEBT_REJECTED',
        //         }
        //         this.props.dispatch(getProviderDuePayments(kwargs))
        // }
    }
    
    buildTableBody(){
        let div_index = 0
        const supplier_code = this.props.activeSupplier.code
        const t_h_class = 'unpaidPur-grid-content-label'
        const t_b_class = 'unpaidPur-grid-content-body'
        const headers_labels = ["# Factura", "Fecha", 'Monto', 'Abonos', 'Deuda', 'Movimientos']
        const header = headers_labels.map(label=>{
            let a = <div className={t_h_class} key = {div_index}>{label}</div>
            div_index +=1
            return a
        })

        let makeBodyDiv = (value, key) =>{return <div className={t_b_class} key={key}>{value}</div>}

        const body_rows = this.props.supplierActivePurchasesWithDebt.map((pur)=>{
            const debits = parseFloat(pur.purchase_total) - parseFloat(pur.balance)
            const row = []
            div_index+=1
            row.push(makeBodyDiv(pur.consecutive, div_index)) 
            div_index+=1
            row.push(makeBodyDiv(pur.invoice_date, div_index)) //Fecha en factura ingresada
            div_index+=1
            row.push(makeBodyDiv(parseFloat(pur.purchase_total).formatMoney(2, ',', '.'), div_index)) //total venta
            div_index+=1
            row.push(makeBodyDiv(debits.formatMoney(2, ',', '.'), div_index)) //abonos a la factura
            div_index+=1
            row.push(makeBodyDiv(parseFloat(pur.balance).formatMoney(2, ',', '.'),div_index)) //saldo
            div_index+=1
            row.push(<div className={t_b_class} key={div_index}> <Link to={`/payables/duepay/${supplier_code}/${pur.consecutive}`}>Ver Movimientos</Link> </div>)
            return row
        })
        let all_rows = header
        body_rows.forEach(element => {
           all_rows = all_rows.concat(element) 
        })
        return all_rows

    }


    render() {
        const sup = this.props.activeSupplier
        const supplier_data = `${sup.code} - ${sup.name}` + (sup.phone_number != '' ?  ` - Tel: ${sup.phone_number}`:'')

        const total_debt = sup.balance?parseFloat(sup.balance).formatMoney(2,',','.'):0
        return <div className="unpaidPur" >
            <div className='unpaidPur-grid'>
                <div className="unpaidPur-grid-title">
                    <div className='unpaidPur-grid-title-upper' >
                        <h1>LISTADO DE COMPRAS PENDIENTES POR PAGAR </h1>
                    </div>

                    <div className="unpaidPur-grid-title-lower">
                        <div className='unpaidPur-grid-title-lower-label' >Proveedor:</div>
                        <div className='unpaidPur-grid-title-lower-data' >{supplier_data}</div>
                        <div></div>
                        <div className='unpaidPur-grid-title-lower-label' >Saldo Total:</div>
                        <div className='unpaidPur-grid-title-lower-data' >{'₡ ' + total_debt}</div>
                        <div ></div>
                    </div> 
                </div>

                <div className="unpaidPur-grid-content">
                    {this.buildTableBody()}
                </div>
            </div>
        </div>
    }
}