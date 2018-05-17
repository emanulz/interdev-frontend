let inspect = require('util-inspect')
import React from 'react'
import {connect} from 'react-redux'
import {updateQty} from '../partsProvider/actions'
import {deleteItemDispatch} from '../../../../utils/api'
import {updateLaborOrCashAdvanceRow} from '../partsProvider/actions'

@connect((store)=>{
    return {
        cashAdvanceList: store.transactionsList.cashAdvanceList,
        cashAdvanceListOld: store.transactionsList.cashAdvanceListOld,

        partsRequestList: store.transactionsList.partsRequestList,
        partsRequestListOld: store.transactionsList.partsRequestListOld,

        laborList: store.transactionsList.laborList,
        laborListOld : store.transactionsList.laborListOld,
        user: store.user
    }
})

export default class TransactionItems extends React.Component {


    qtyInputChange(item_uuid , e){
        const qty = parseFloat(e.target.value)
        ? e.target.value
        :0
        this.props.dispatch(
            updateQty(qty, this.props.partsRequestList, item_uuid)
        )
    }

    descInputChange(item, e){
        let list = ''
        if(item.type === 'LABOR'){
            list = this.props.laborList
        }else{
            list = this.props.cashAdvanceList
        }
               
        this.props.dispatch(
            updateLaborOrCashAdvanceRow(item, e, list)
        )
    }

    transactionDelete(item_uuid, type, e){
        switch(type){
            case 'LABOR':
            {
                let index = this.props.laborList.findIndex(a=>a.uuid === item_uuid)
                const kwargs = {
                    item:this.props.laborList[index].element,
                    url: `/api/labor/${this.props.laborList[index].element.id}`,
                    modelName: 'LABOR',
                    logCode: 'Mano de obra Borrada',
                    itemOld: this.props.laborList[index],
                    logModel: 'LABOR',
                    user: JSON.stringify(this.props.user),
                    dispatchType: 'LABOR_ITEM_DELETED'
                }
                this.props.dispatch({type:'FETCHING_STARTED'})
                this.props.dispatch(deleteItemDispatch(kwargs))
                break
            }
            case 'CASH_ADVANCE':
            {
                let index = this.props.cashAdvanceList.findIndex(a=>a.uuid === item_uuid)
                const kwargs = {
                    item:this.props.cashAdvanceList[index].element,
                    url:`/api/cashadvances/${this.props.cashAdvanceList[index].element.id}`,
                    modelName: 'CASH_ADVANCE',
                    logCode: 'Adelanto de dinero borrado',
                    itemOld: this.props.cashAdvanceList[index],
                    logModel: 'CASH_ADVANCE',
                    user: JSON.stringify(this.props.user),
                    dispatchType: 'CASH_ADVANCE_DELETED'
                }

                this.props.dispatch({type:'FETCHING_STARTED'})
                this.props.dispatch(deleteItemDispatch(kwargs))
                break
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
            .concat(this.props.laborList)

        const transactionsItems = transactions.map((item, index) =>{
            //determine wether it is saved, modified or new
            let status_class = itemRowClass + "-status-new"
            let status = 'Nuevo'
            if(item.element.work_order_id!==undefined){
                status = item.saved?'Guardado':'Modificado'
                status_class = item.saved?itemRowClass + "-status-saved":itemRowClass + "-status-modified"
            }


            const disable_quantity = item.type === 'PART_REQUEST' ? false : true
            const qtyField = <input
                id={`qty${item.qty}`}
                disabled={disable_quantity}
                onChange={this.qtyInputChange.bind(this, item.uuid)}
                type='number'
                className='form-control'
                value={item.qty}
            />

            let movementType = ''
            let desc_element = ''
            let unit_price_element = ''

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
                        ₡ {parseFloat(item.priceToUse)}
                    </div>

                    break
                }

                case 'CASH_ADVANCE':
                {
                    movementType = 'Adelanto'
                    desc_element = <div className={itemRowClass+"-description"}>
                        <input type='text'
                        name='description' 
                        value={item.element.description}
                        className={itemRowClass+"-description-input" + " form-control"}
                        onChange={this.descInputChange.bind(this, item)} />
                    </div>

                    unit_price_element = <div className={itemRowClass+"-unitProce"} >
                        <input type="text" name='amount'
                        value={item.priceToUse}
                        className={itemRowClass+"description-input form-control"}
                        onChange={this.descInputChange.bind(this, item)}/>
                    </div>

                    break
                }
                case 'LABOR':
                {
                    movementType = 'Mano de Obra'
                    desc_element = <div className={itemRowClass+"-description"}>
                        <input type='text' name='description' 
                        value={item.element.description}
                        className={itemRowClass+"-description-input" + " form-control"}
                        onChange={this.descInputChange.bind(this, item)} />
                    </div>

                    unit_price_element = <div className={itemRowClass+"-unitProce"} >
                        <input type="text" name='amount'
                        value={item.priceToUse}
                        className={itemRowClass+"description-input form-control"}
                        onChange={this.descInputChange.bind(this, item)}/>
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

                <div className={itemRowClass + "-total"}>
                    <h5>Total</h5>
                    ₡ {parseFloat(item.subTotal)}
                </div>

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