import React from 'react'
import {connect} from 'react-redux'

import TransactionItems from './transactionItems.jsx'

@connect((store)=>{
    return{
        showPrices:store.workshopview.showPrices
    }
})

export default class TransactionsList extends React.Component {

    render(){
        console.log("Show prices --> " + this.props.showPrices)
        const puColumnHeader = this.buildUPHeader()
        const totalColumnHeader = this.buildTotalHeader()
        return <div className="transactions">
            <div className="transactions-header">
                <div className="transactions-header-code">
                    <h5>Cód</h5>
                </div>
                <div className="transactions-header-qty">
                    <h5>Cant.</h5>
                </div>
                <div className="transactions-header-name">
                    <h5>Nombre</h5>
                </div>
                <div className="transactions-header-type">
                    <h5>Tipo</h5>
                </div>
                {puColumnHeader}
                {totalColumnHeader}

            </div>
            <TransactionItems />
        </div>
    }

    buildUPHeader() {
        let element = ''
        if(this.props.showPrices){
            element = <div className="transactions-header-unitPrice">
                <h5>P.U</h5>
            </div>
        }
        return element
    }

    buildTotalHeader() {
        let element = ''
        if(this.props.showPrices){
            element=<div className="transactions-header-total">
                <h5>Total</h5>
            </div>
        }
        return element
    }

}