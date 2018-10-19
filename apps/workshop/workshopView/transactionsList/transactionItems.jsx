let inspect = require('util-inspect')
import React from 'react'
import {connect} from 'react-redux'
import {updateQty} from '../partsProvider/actions'
import {updateLaborCashAdvanceUsedPartInfoRow} from '../partsProvider/actions'

@connect((store)=>{
    return {
        cashAdvanceList: store.transactionsList.cashAdvanceList,
        partsRequestList: store.transactionsList.partsRequestList,
        laborList: store.transactionsList.laborList,
        usedPartList: store.transactionsList.usedPartList,
        informativeList: store.transactionsList.informativeList,
        user: store.user,
        is_closed: store.workshopview.work_order.is_closed,
        sales_warehouse: store.transactionsList.sales_warehouse,
    }
})

export default class TransactionItems extends React.Component {


    qtyInputChange(item_uuid , e){
        const qty = parseFloat(e.target.value)
        ? e.target.value
        :0
        this.props.dispatch(
            updateQty(qty, this.props.partsRequestList, item_uuid, this.props.sales_warehouse)
        )
    }

    transactionChange(item, e){
        let list = ''
        if(item.type === 'LABOR'){
            list = this.props.laborList
        }else if(item.type == 'CASH_ADVANCE'){
            list = this.props.cashAdvanceList
        }else if(item.type == 'USED_PART'){
            list = this.props.usedPartList
        }else if(item.type=='INFORMATIVE_MOVEMENT'){
            list = this.props.informativeList
        }
               
        this.props.dispatch(
            updateLaborCashAdvanceUsedPartInfoRow(item, e, list)
        )
    }

    transactionDelete(item_uuid, type, e){
        if(this.props.is_closed){
            this.props.dispatch({type:'CANT_DELETE_FROM_CLOSED_ORDER'})
            return
        }
        switch(type){
            case 'USED_PART':
            {
                let index = this.props.usedPartList.findIndex(a=>a.uuid === item_uuid)
                //check if the item was already store in the database
                const item =  this.props.usedPartList[index]
                this.props.dispatch({type:'USED_PART_DELETED', payload:item.uuid})
                break
            }
            case 'LABOR':
            {
                let index = this.props.laborList.findIndex(a=>a.uuid === item_uuid)
                //check if the item was already stored in the database
                const item = this.props.laborList[index]
                this.props.dispatch({type:'LABOR_ITEM_DELETED', payload:item.uuid})
                break
            }
            case 'CASH_ADVANCE':
            {
                let index = this.props.cashAdvanceList.findIndex(a=>a.uuid === item_uuid)
                //check if the item was already stored in the database
                const item =this.props.cashAdvanceList[index]
                this.props.dispatch({type:'CASH_ADVANCE_DELETED', payload:item.uuid})
                break
            }
            case 'PART_REQUEST':
            {
                let index =  this.props.partsRequestList.findIndex(a=>a.uuid === item_uuid)
                const item = this.props.partsRequestList[index]
                this.props.dispatch({type:'PART_REQUEST_DELETED', payload:item.uuid})
                break
            }
            case 'INFORMATIVE_MOVEMENT':
            {
                let index = this.props.informativeList.findIndex(a=>a.uuid === item_uuid)
                const item = this.props.informativeList[index]
                this.props.dispatch({type:'INFORMATIVE_MOVEMENT_DELETED', payload:item.uuid})
            }
            default:{
                console.log('Unsuported type of transaction ' + type)
            }
        }
    }

    render(){


        const removeIconClass = 'removeItemIcon'
        const itemRowClass = 'transactions-body-item'

        const transactions = this.props.partsRequestList.concat(this.props.cashAdvanceList)
            .concat(this.props.laborList).concat(this.props.usedPartList).concat(this.props.informativeList)

        const transactionsItems = transactions.map((item, index) =>{
            //determine wether it is saved, modified or new
            let status_class = itemRowClass + "-status-new"
            let status = 'Nuevo'
            if(item.element.work_order_id!==undefined){
                status = item.saved?'Guardado':'Modificado'
                status_class = item.saved?itemRowClass + "-status-saved":itemRowClass + "-status-modified"
            }
            //the parts request from the main inventory are an special case, the product as defined in the db does not have
            //a related work_order_id
            if(item.type === 'PART_REQUEST'){
                status = item.saved?'Guardado':'Nuevo'
                status_class = item.saved?itemRowClass + "-status-saved":itemRowClass + "-status-new"
            }

            const disable_quantity = item.type === 'PART_REQUEST' ? (item.saved?true:false) : true
            const qtyField = <input
                id={`qty${item.qty}`}
                disabled={disable_quantity || this.props.is_closed}
                onChange={this.qtyInputChange.bind(this, item.uuid)}
                type='number'
                className='form-control'
                value={item.qty}
            />

            let movementType = ''
            let desc_element = ''
            let unit_price_element = ''
            let total_element =<div className={itemRowClass + "-total"}>
                <h5>Total</h5>
                ₡ {parseFloat(item.subTotal).toFixed(2)}
            </div>

            switch(item.type){
                case 'PART_REQUEST':
                {
                    movementType ='Requisición Repuesto'

                    desc_element = <div className={itemRowClass + "-description"}>
                        <h5>Desc</h5>
                        {item.element.description}
                    </div>

                    unit_price_element = <div className={itemRowClass + "-unitPrice"}>
                        <h5>P Unit</h5>
                        ₡ {parseFloat(item.priceToUse).toFixed(2)}
                    </div>

                    break
                }

                case 'CASH_ADVANCE':
                {
                    movementType = 'Adelanto'
                    desc_element = <div className={itemRowClass+"-description"}>
                        <input type='text'
                        disabled={this.props.is_closed}
                        name='description' 
                        value={item.element.description}
                        className={itemRowClass+"-description-input" + " form-control"}
                        onChange={this.transactionChange.bind(this, item)} />
                    </div>

                    unit_price_element = <div className={itemRowClass+"-unitProce"} >
                        <input type="text" name='amount'
                        disabled={this.props.is_closed}
                        value={parseFloat(item.priceToUse).toFixed(2)}
                        className={itemRowClass+"description-input form-control"}
                        onChange={this.transactionChange.bind(this, item)}/>
                    </div>

                    break
                }
                case 'LABOR':
                {
                    movementType = 'Mano de Obra'
                    desc_element = <div className={itemRowClass+"-description"}>
                        <input type='text' name='description' 
                        disabled={this.props.is_closed}
                        value={item.element.description}
                        className={itemRowClass+"-description-input" + " form-control"}
                        onChange={this.transactionChange.bind(this, item)} />
                    </div>

                    unit_price_element = <div className={itemRowClass+"-unitPrice"} >
                        <input type="text" name='amount'
                        disabled={this.props.is_closed}
                        value={parseFloat(item.priceToUse).toFixed(2)}
                        className={itemRowClass+"description-input form-control"}
                        onChange={this.transactionChange.bind(this, item)}/>
                    </div>
                    break
                }
                case 'USED_PART':
                {
                    movementType = "Repuesto Usado"
                    desc_element = <div className={itemRowClass+"-description"} >
                        <input type='text' name='description'
                        disabled={this.props.is_closed}
                        value={item.element.description}
                        className={itemRowClass+"-description-input"+ " form-control"}
                        onChange={this.transactionChange.bind(this, item)} />
                    </div>

                    unit_price_element =  <div className={itemRowClass+"-unitPrice"} >
                        <input type="text" name="amount"
                        disabled={this.props.is_closed}
                        value={parseFloat(item.priceToUse).toFixed(2)}
                        className={itemRowClass+"description-input form-control"}
                        onChange={this.transactionChange.bind(this, item)} />
                    </div>
                    break
                }

                case 'INFORMATIVE_MOVEMENT':
                {
                    movementType = "Movimiento Informativo"
                    desc_element = <div className={itemRowClass+"-description"} >
                        <input type='text' name='description'
                        disabled={this.props.is_closed}
                        value={item.element.description}
                        className={itemRowClass+"-description-input"+ " form-control"}
                        onChange={this.transactionChange.bind(this, item)} />
                    </div>
                    unit_price_element = <div className={itemRowClass + "-unitPrice"} >
                        <h5>Precio Unitario</h5>
                         {"N/A"}
                    </div>
                    total_element =<div className={itemRowClass + "-total"}>
                        <h5>Total</h5>
                         {"N/A"}
                    </div>
                    break
                }
            }

            return <div className={itemRowClass} key={item.uuid}>

                <div className={itemRowClass + "-code"}>
                    <h5> Código</h5>
                    <div className={itemRowClass + "-code-icon " +"fa fa-trash-o"} 
                    onClick={this.transactionDelete.bind(this, item.uuid, item.type)} ></div> 
                    <div className={itemRowClass + "-code-value "}>
                        {item.element.code? item.element.code: 'N/A'}
                    </div> 
                </div>

                <div className={itemRowClass + "-qty"}>
                    <h5>Cantidad</h5>
                    {qtyField}
                </div>

                {desc_element}

                <div className={itemRowClass + "-type"} >
                    <h5>Tipo</h5>
                    {movementType}
                </div>

                {unit_price_element}

                {total_element}

                <div className={status_class} >
                    <h5>Estado</h5>
                    {status}
                </div>
                <span className={removeIconClass}/>

            </div>

        })

        return <div className='transactions-body'>
            {transactionsItems}
        </div>
    }
}