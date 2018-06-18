import React from 'react'
import {connect} from 'react-redux'
import { setItem } from '../../../../utils/api'
import {getPurchaseMovements} from '../../general/actions.js'
import {formatDateTime} from '../../../../utils/formatDate.js'

@connect(store=>{
    return{
        purchaseActive: store.purchaseMovements.purchaseActive,
        purchaseMovements: store.purchaseMovements.purchaseMovements,
    }
})
export default class PurchaseMovementsList extends React.Component {
    
    componentWillMount(){
        this.props.dispatch({type:'CLEAR_PURCHASE'})
        const lookUp = this.props.location.pathname.split('/').pop()

        const kwargs ={
            lookUpField: 'consecutive',
            url: '/api/purchase/',
            lookUpValue: lookUp,
            dispatchType: 'SET_PURCHASE',
            dispatchType2: 'SET_PURCHASE_OLD',
            dispatchErrorType: 'PURCHASE_NOT_FOUND',
            lookUpName: 'Consecutivo de Factura',
            modelName: 'Compras',
            reidrectUrl: '/payables/duepay',
            history: this.props.history
        }

        this.props.dispatch({type:'FETCHING_STARTED'})
        this.props.dispatch(setItem(kwargs))

    }

    componentWillReceiveProps(nextprops){
        if(nextprops.purchaseActive.id != '0000' && nextprops.purchaseActive.id != this.props.purchaseActive.id){
            const id = nextprops.purchaseActive.id

            const kwargs = {
                url:'/api/payablescreditmovement',
                purchase_id: id,
                successType: 'FETCH_PAYABLE_CREDIT_MOVEMENTS_FULFILLED',
                errorType: 'FETCH_PAYABLE_CREDIT_MOVEMENTS_REJECTED'
            }
            this.props.dispatch(getPurchaseMovements(kwargs))
        }
    }

    buildContentSummary(data_pairs){
        const l_c ="purMovs-content-right-label"
        const d_c ="purMovs-content-right-data"
        let item_key = 0
        let divMaker = (value,div_class, key) => {return <div className={div_class} key={key}>{value}</div>}
        let elements = []
        data_pairs.forEach((item)=>{
            elements.push(divMaker(item.label, l_c, item_key))
            item_key+=1
            elements.push(divMaker(item.value, d_c, item_key))
            item_key+=1
        })
        
        return elements
    }

    buildContentData(){
        let div_index = 0

        const t_h_class = 'purMovs-content-left-header'
        const t_b_class = 'purMovs-content-left-body'
        const headers_labels = ['Movimiento #', 'Fecha', 'Tipo', 'Monto', 'Detalle']

        const header = headers_labels.map(label =>{
            let a = <div className={t_h_class} key={div_index} >{label}</div>
            div_index+=1
            return a
        })

        let makeBodyDiv = (value, key) =>{return <div className={t_b_class} key={key}>{value}</div>}

        const body_rows = this.props.purchaseMovements.map(mov=>{
            const row = []
            row.push(makeBodyDiv(mov.consecutive, div_index))
            div_index+=1
            row.push(makeBodyDiv(formatDateTime(mov.updated), div_index))
            div_index+=1
            let type = mov.movement_type == 'CRED'? 'Crédito': 'Débito'
            row.push(makeBodyDiv(type, div_index))
            div_index+=1
            row.push(makeBodyDiv(mov.amount.formatMoney(2, ',', '.'), div_index))
            div_index+=1
            row.push(makeBodyDiv(mov.description, div_index))
            div_index+=1
            return row
        })

        let all_rows = header
        body_rows.forEach(element=>{
            all_rows = all_rows.concat(element)
        })
        return all_rows
    }

    render(){
        
        const debt_data = this.props.purchaseActive.debt_data
        if(!debt_data){return ''}
        const content_summary = this.buildContentSummary([{label:'Créditos', value: `₡ ${debt_data.credits.formatMoney(2, ',', '.')}`}, 
                                                        {label:'Débitos', value: `₡ ${debt_data.debits.formatMoney(2, ',', '.')}`}, 
                                                        {label:'Saldo', value: `₡ ${debt_data.debt.formatMoney(2, ',', '.')}`}])
        return <div className='purMovs'>
            <div className="purMovs-header">
                <h1>{`Movimientos de Compra # ${this.props.purchaseActive.consecutive}`}</h1>
            </div>
            <div className="purMovs-content">
                <div className="purMovs-content-left">
                    {this.buildContentData()}
                </div>
                <div className="purMovs-content-right">
                    {content_summary}
                </div>
            </div>
        </div>
    }
}