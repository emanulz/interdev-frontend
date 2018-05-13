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
        const partItems = partsRequest.map((item, index) =>{

            const qtyField = <input
                id={`qty${item.part.code}`}
                type='number'
                className='form-control'
                //onChange={undefined}
                //value={item.qty}
            />

            return <div className={itemRowClass} key={item.uuid}>

                <div className={itemRowClass + "-code"}>
                    <h5>Código</h5>
                    {item.part.code}
                </div>

                <div className={itemRowClass + "-description"}>
                    <h5>Desc</h5>
                    {item.part.description}
                </div>

                <div className={itemRowClass + "-qty"}>
                    <h5>Cantidad</h5>
                    {qtyField}
                </div>

                <div className={itemRowClass + "-type"} >
                    <h5>Tipo</h5>
                    Requisición Parte
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
        console.log("Part items size" +  partItems.length)
        return <div className='transactions-body'>
            {partItems}
        </div>
    }
}