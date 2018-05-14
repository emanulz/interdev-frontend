let inspect = require('util-inspect')
import React from 'react'
import {connect} from 'react-redux'

@connect((store)=>{
    return {
        cashAdvanceList: store.transactionsList.cashAdvanceList,
        partsRequestList: store.transactionsList.partsRequestList,
        laborList: store.transactionsList.laborList
    }
})

export default class TransactionItems extends React.Component {


    render(){

        const partsRequest = this.props.partsRequestList

        const removeIconClass = 'removeItemIcon'
        const itemRowClass = 'transactions-body-item'

        const transactions = this.props.partsRequestList.concat(this.props.cashAdvanceList)
            .concat(this.props.laborList)

        const transactionsItems = transactions.map((item, index) =>{

            const qtyField = <input
                id={`qty${item.qty}`}
                type='number'
                className='form-control'
            />

            let movementType = ''
            switch(item.type){
                case 'PART_REQUEST':
                {
                    movementType ='Requisición Repuesto'
                    break
                }

                case 'CASH_ADVANCE':
                {
                    movementType = 'Adelanto'
                    break
                }
                case 'LABOR':
                {
                    movementType = 'Mano de Obra'
                    break
                }
            }

            return <div className={itemRowClass} key={item.uuid}>

                <div className={itemRowClass + "-code"}>
                    <h5>Código</h5>
                    {item.element.code? item.element.code: 'N/A'}
                </div>

                <div className={itemRowClass + "-qty"}>
                    <h5>Cantidad</h5>
                    {qtyField}
                </div>

                <div className={itemRowClass + "-description"}>
                    <h5>Desc</h5>
                    {item.element.description}
                </div>

                <div className={itemRowClass + "-type"} >
                    <h5>Tipo</h5>
                    {movementType}
                </div>

                <div className={itemRowClass + "-unitPrice"}>
                    <h5>P Unit</h5>
                    ₡ {parseFloat('9999.99')}
                </div>

                <div className={itemRowClass + "-total"}>
                    <h5>Total</h5>
                    ₡ {4578.45}
                </div>

                <span className={removeIconClass}/>

            </div>

        })

        return <div className='transactions-body'>
            {transactionsItems}
        </div>
    }
}