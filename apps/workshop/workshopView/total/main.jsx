import React from 'react'
import {connect} from 'react-redux'


@connect(store=>{
    return {
        transactions: store.transactionsList,
        is_warranty: store.workshopview.work_order.is_warranty,
    }
})
export default class WorkshopTotal extends React.Component {



    render(){

    //calculate cash advances
    const total_advances = this.props.transactions.cashAdvanceList.reduce(
        (total, current)=> {return total + parseFloat(current.subTotal)},
        0.0)

    //calculate the total in labor
    const total_labor = this.props.transactions.laborList.reduce(
        (total, current) => {return total + parseFloat(current.subTotal)},
        0.0)

    //calculate the used parts total
    const total_used_parts = this.props.transactions.usedPartList.reduce(
        (total, current) => {return total + parseFloat(current.subTotal)},
        0.0)

    //calculate the parts total
    const total_parts_request = this.props.transactions.partsRequestList.reduce(
        (total, current)=>{return total + parseFloat(current.subTotal)},
        0.0)

    const subtotal = total_labor + total_used_parts + total_parts_request

        const item = this.props.is_warranty?'':
        <div className="total-container">
            <div className="total-container-subtotal">
                <div className="total-container-subtotal-label">Subtotal:</div>
                <div className="total-container-subtotal-value">{` ₡ ${subtotal.toFixed(2)}`}</div>
            </div>

            <div className="total-container-advances">
                <div className="total-container-advances-label">Adelantos:</div>
                <div className="total-container-advances-value">{` ₡ ${total_advances.toFixed(2)}`}</div>
            </div>

            <div className="total-container-balance">
                <div className="total-container-balance-label">Saldo:</div>
                <div className="total-container-balance-value">{` ₡ ${subtotal-total_advances.toFixed(2)}`}</div>
            </div>
        </div>
        return item
        //return `CASH_ADVANCES --> ${total_advances} USED_PARTS--> ${total_used_parts} LABOR--> ${total_labor} PARTS --> ${total_parts_request}`
    }
}