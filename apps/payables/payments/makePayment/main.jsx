import React from 'react'
import {connect} from 'react-redux'
let inspect = require('util-inspect')
import SupplierProvider from '../../../../general/supplierProvider/main.jsx'
import {savePayableCreditMovementPromise, savePayableCreditPaymentPromise} from '../../../../utils/api.js'
import {getProviderDuePayments} from '../../general/actions.js'
import {getItemDispatch} from '../../../../utils/api.js'

@connect(store=>{
    return {
        suppliers: store.suppliers.suppliers,
        activeSupplier: store.suppliers.activeSupplier,
        supplierActivePurchasesWithDebt: store.unpaidPurchases.supplierActivePurchasesWithDebt,
        paymentArray: store.makePayment.paymentArray,
        user: store.user.user,
    }
})
export default class MakePayment extends React.Component {
    componentWillMount() {
        //clear the selected supplier
        this.props.dispatch({type:'CLEAR_ACTIVE_SUPPLIER'})
        this.props.dispatch({type:'CLEAR_SUPPLIER_PURCHASES_WITH_DEBT'})
    }

    componentWillReceiveProps(nextprops){
        // if(nextprops.activeSupplier.id != '00000000-0000-0000-0000-000000000000' && 
        //     nextprops.activeSupplier.id != this.props.activeSupplier.id){
            
        //     const id = nextprops.activeSupplier.id
        //     const kwargs = {
        //         supplier_id: id,
        //         successType: 'FETCH_SUPPLIER_PURCHASES_WITH_DEBT_FULFILLED',
        //         errorType: 'FETCH_SUPPLIER_PURCHASES_WITH_DEBT_REJECTED',
        //     }
        //     this.props.dispatch(getProviderDuePayments(kwargs))
        // }

        // //check if the supplier purchases with debt were received
        // if(this.props.supplierActivePurchasesWithDebt.length == 0
        //      && nextprops.supplierActivePurchasesWithDebt.length>0 ){

        //     const payload_data = nextprops.supplierActivePurchasesWithDebt.map(item=>{
        //         return {
        //             id:item.id,
        //             value: item.debt_data.debt,
        //             is_complete:true,
        //         }
        //     })
        //     this.props.dispatch({type:'SET_PAYMENTS', payload: payload_data})
        // }
    }

    selectSupplier(e){
        const target = e.target
        const value = target.value
        const activeClient = this.props.suppliers.findIndex(a=>a.index = value)
        this.props.dispatch({type:'SET_SUPPLIER', payload:this.props.suppliers[activeClient]})
    }

    handlePayAmount(pur, e){
        //if the amount changed, clear the complete, of the check box if it is smaller
        const full_debt =  pur.debt_data.debt
        const raw_payment = parseFloat(e.target.value)?parseFloat(e.target.value):0
        if(raw_payment===undefined || raw_payment<0){return}
        const is_complete = Math.abs(raw_payment - full_debt)<0.000001 || raw_payment> full_debt?true:false
        let new_payment_val=0
        if(is_complete){
            new_payment_val = full_debt
        }else{
            new_payment_val = raw_payment>full_debt?full_debt:raw_payment
        }
        
        this.props.dispatch({
            type:'SET_PAYMENT_AMOUNT', 
            payload:{id:pur.id, value:new_payment_val, is_complete: is_complete}
        })
    }

    handlePayComplete(pur, e){
       const amount = e.target.value
       ? pur.debt_data.debt
       : paymentArray.find(a=>a.id === pur.id).value

       this.props.dispatch({
           type:'SET_PAYMENT_AMOUNT',
           payload:{id:pur.id, value:amount, is_complete: e.target.value}
       })
    
    }

    reFetchSuppliers(){
        const providersKwargs = {
            url:'/api/suppliers',
            successType: 'FETCH_SUPPLIERS_FULFILLED',
            errorType: 'FETCH_SUPPLIERS_REJECTED'
        }

        //load the providers data, which will include the due debt
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch(getItemDispatch(providersKwargs))
    }

    clearSelectedPaymentsWithDebt(){
        this.props.dispatch({type:'CLEAR_SUPPLIER_PURCHASES_WITH_DEBT'})
        this.props.dispatch({type:'CLEAR_PAYMENTS'})
        this.props.dispatch({type:'CLEAR_ACTIVE_SUPPLIER'})
    }

    savePayments(){
        console.log('Save me')
        const user_string = JSON.stringify(this.props.user)
        const supplier_string = JSON.stringify(this.props.activeSupplier)
        const supplier_id = this.props.activeSupplier.id
        //create a save promise for each payment
        const payments_promise = this.props.paymentArray.map(item=>{
            const pur = this.props.supplierActivePurchasesWithDebt.find(a=>a.id===item.id)
            const amount = item.value
            const description = `Pago a factura ${pur.consecutive}`

            let kwargs = {
                purchase: pur,
                user: user_string,
                supplier: supplier_string,
                supplier_id: supplier_id,
                amount: amount,
                description: description,
            }
            return savePayableCreditPaymentPromise(kwargs)
        })

        Promise.all(payments_promise).then(payments=>{
            const credits_promises =  payments.map(payment=>{
                const purchase_id = JSON.parse(payment.purchase).id
                let kwargs = {
                    supplier_id: payment.supplier_id,
                    purchase_id: purchase_id,
                    payment_id: payment.id,
                    movement_type: 'DEBI',
                    amount: payment.amount,
                    description: payment.description
                }
                return savePayableCreditMovementPromise(kwargs)
            })

            Promise.all(credits_promises).then(results=>{
                this.props.dispatch({type:'FETCHING_STARTED'})
                this.props.dispatch({type:'CLEAR_PAYMENTS'})
                this.props.dispatch({type:'CLEAR_ACTIVE_SUPPLIER'})
                this.props.dispatch({type:'CLEAR_SUPPLIER_PURCHASES_WITH_DEBT'})
                this.props.dispatch({type:'CLEAR_SUPPLIERS_ALL'})
                this.reFetchSuppliers()
                this.props.dispatch({type:'PAYMENTS_CREDITS_SAVED_CORRECTLY'})
            })
        })


    }


    buildTableContent(payments_array) {

        let key_val = 0
        const h_c = 'makePayment-grid-content-header'
        const b_c = 'makePayment-grid-content-body'

        const header_labels = ['Fact #', 'Fecha', 'Total', 'Deuda', 'Completa', 'Monto']

        const header = header_labels.map(item=>{
            let a = <div className={h_c} key={key_val} >{item}</div>
            key_val +=1
            return a
        })

        let mkDiv = (val)=>{
            let a = <div className={b_c} key={key_val}>{val}</div>
            key_val +=1
            return a
        }
        const body = this.props.supplierActivePurchasesWithDebt.map(pur=>{
            const row = []
            row.push(mkDiv(pur.consecutive))
            row.push(mkDiv(pur.invoice_date))
            row.push(mkDiv(pur.cart.cartTotal))
            row.push(mkDiv(pur.debt_data.debt))

            if(payments_array.length>0){
                const index = payments_array.findIndex(a=>a.id === pur.id)

                row.push(<div className='makePayment-grid-content-body' key={key_val}>
                    <input type='checkbox' checked={payments_array[index].is_complete} onChange={this.handlePayComplete.bind(this, pur)}></input>
                    </div>)
                key_val +=1
                row.push(<div className='makePayment-grid-content-body' key={key_val}>
                    <input onChange={this.handlePayAmount.bind(this, pur)} 
                    value={payments_array[index].value} placeholder='Ingrese el monto..' type='text'
                    className='form-control'/>
                    </div>)
                key_val +=1
            }else{
                row.push(<div key={key_val} />)
                key_val +=1
                row.push(<div key={key_val} />)
                key_val +=1
            }

            return row
        })

        let all_rows = header
        body.forEach(element => {
            all_rows = all_rows.concat(element)
        })
        return all_rows
    }

    render(){
        const payments_array = this.props.paymentArray ? this.props.paymentArray:[]

             
        let old_debt = this.props.activeSupplier.debt_to ? this.props.activeSupplier.debt_to : 0

        let payment_total = 0
        this.props.paymentArray.forEach(item => {
            payment_total += item.value
        })

        let new_debt = old_debt - payment_total

        return <div className='makePayment' >
                <div className='makePayment-grid'>
                    <div className="makePayment-grid-header">
                        <h1>Registrar Pago a Compras</h1>
                    </div>

                    <SupplierProvider />

                    <div className="makePayment-grid-summary">
                        <div className="makePayment-grid-summary-left">
                            <div>Saldo Anterior:</div>
                            <div>Este Abono:</div>
                            <div>Saldo:</div>
                        </div>

                        <div className="makePayment-grid-summary-middle">
                            <div>{`₡ ${parseFloat('99').formatMoney(2, ',', '.')}`}</div>
                            <div>{`₡ ${payment_total.formatMoney(2, ',', '.')}`}</div>
                            <div>{`₡ ${parseFloat('88').formatMoney(2, ',', '.')}`}</div>
                        </div>

                        <div className="makePayment-grid-summary-right">
                            <button className='form-control' onClick={this.savePayments.bind(this)}>
                                Registrar
                            </button>
                        </div>

                    </div>

                    <div className="makePayment-grid-content">
                    
                        {this.buildTableContent(payments_array)}

                    </div>
                </div>
        </div>
    }
}