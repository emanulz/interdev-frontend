let inspect = require('util-inspect')
const uuidv1 = require('uuid/v1')
import alertify from 'alertifyjs'

export function updateQty(qty, itemsList, target_uuid){
    const index = itemsList.findIndex(item=>item.uuid == target_uuid)

    const qtyNumber = parseFloat(qty)
     const res = {
         type: 'UPDATE_PARTS_LIST',
         payload: {item:updatePartInTransactionList(itemsList,index, qtyNumber),
                    index: index }
    }
    return res
}

export function buildUsedPartRequest(amount, description){
    const subTotal  = calculateUsedPartSubTotal(amount)
    return {
        type:'ADD_TO_USED_PART_LIST',
        payload:{
            uuid: uuidv1(),
            element: {'amount':amount, 'description': description, 'subTotal': subTotal},
            qty: 1,
            type: 'USED_PART',
            priceToUse: amount,
            subTotal: subTotal,
            saved: false
        }
    }
}

//build a cash advance request
export function buildCashAdvanceRequest(amount, description){
    const subTotal = calculateAdvanceSubTotal(amount)
    return{
        type:'ADD_TO_CASH_ADVANCE_LIST',
        payload:{
            uuid: uuidv1(),
            element:{'amount': amount, 'description':description, 'subTotal': subTotal},
            qty: 1,
            type:'CASH_ADVANCE',
            priceToUse: amount,
            subTotal: subTotal,
            saved: false
        }
    }
}

export function buildLaborRequest(amount, description){
    const sub = calculateLaborSubTotal(amount)
    return{
        type:'ADD_TO_LABOR_LIST',
        payload:{
            uuid: uuidv1(),
            element:{'amount': amount, 'description':description},
            qty: 1,
            type:'LABOR',
            priceToUse: amount,
            subTotal: sub,
            saved: false,
        }
    }
}

export function updateLaborCashAdvanceUsedPartRow(item, e, list){

    
        let val = e.target.value
        console.log(e.target.name)
        //check if the property is amount, if it is it must parse to float
        if(e.target.name ==='amount'){
            const val2 = parseFloat(e.target.value)
            if(isNaN(val2)){
                return {type: 'INVALID_NUMERIC_VALUE'}
            }
        }

        const index = list.findIndex(a=>a.uuid === item.uuid)
        switch(item.type)
        {
            case 'LABOR':
            {
                const newItem = JSON.parse(JSON.stringify(item))
                newItem.saved = false
                newItem.element[e.target.name] = val
                newItem.priceToUse = newItem.element.amount
                newItem.subTotal = calculateLaborSubTotal(newItem.element.amount)
                return {type:'LABOR_UPDATED', payload:{'item':newItem, 'index':index}}
            }
    
            case 'CASH_ADVANCE':
            {
                const newItem = JSON.parse(JSON.stringify(item))
                newItem.saved = false
                newItem.element[e.target.name] = val
                newItem.priceToUse = newItem.element.amount
                newItem.subTotal= calculateAdvanceSubTotal(newItem.element.amount)
                return {type:'CASH_ADVANCE_UPDATED', payload:{'item':newItem, 'index':index}}
            }

            case 'USED_PART':
            {
                const newItem = JSON.parse(JSON.stringify(item))
                newItem.saved = false
                newItem.element[e.target.name] = val
                newItem.priceToUse = newItem.element.amount
                newItem.subTotal = calculateUsedPartSubTotal(newItem.element.amount)
                return {type:'USED_PART_UPDATED', payload:{'item':newItem, 'index':index}}

            }
    
        }
    }

//handles an user search of a part from the search bar
export function userPartSearchRequest(parts, code, qty, partsRequestList){

    //find the specific part inside the parts collection 
    const targetPartIndex = parts.findIndex(part =>{
        return part.code == code || part.barcode == code
    })
    
    const next_action = (targetPartIndex == -1) ?
    {
        type: 'PART_NOT_FOUND'
    }
    : partAlreadyInTransactionsList(code, qty, parts, partsRequestList, targetPartIndex)
    
    return next_action
}

function partAlreadyInTransactionsList(code, qty, parts, partsRequestList, targetPartIndex){

    const indexInPartsRequestList = partsRequestList.findIndex(part => {
        return part.element.code == code || part.element.barcode == code

    })

    if(indexInPartsRequestList !== -1 && qty == 0){
        return {
            type: 'DELETE_PART_FROM_LIST',
            payload:{index:indexInPartsRequestList}
        }
    }
    const subTotal = calculatePartSubtotal(parts[targetPartIndex], qty)
    
    /*const next_action = (indexInPartsRequestList == -1)
    ?{
        type: 'ADD_TO_PARTS_LIST',
        payload:{
            uuid: uuidv1(),
            element:parts[targetPartIndex],
            qty: qty,
            type:'PART_REQUEST',
            subTotal: subTotal,
            priceToUse: parts[targetPartIndex].price,
            saved: false

        }
    }
    :{
        type: 'UPDATE_PARTS_LIST',
        payload: {
            item: updatePartInTransactionList(partsRequestList, indexInPartsRequestList, qty),
            index: indexInPartsRequestList
        }
    }*/
    const next_action = {type: 'ADD_TO_PARTS_LIST',
                        payload:{
                            uuid: uuidv1(),
                            element:parts[targetPartIndex],
                            qty: qty,
                            type:'PART_REQUEST',
                            subTotal: subTotal,
                            priceToUse: parts[targetPartIndex].price,
                            saved: false

                        }
                        }

    return next_action
}

function updatePartInTransactionList(partsRequestList, indexInPartsRequestList, new_qty){
    //console.log(inspect(partsRequestList))
    //for now, this function will only calculate the new quantity required
    const originalItem = partsRequestList[indexInPartsRequestList]
    return {
        uuid: originalItem.uuid,
        element: originalItem.element,
        qty: new_qty,
        type:originalItem.type,
        subTotal: calculatePartSubtotal(originalItem.element, new_qty),
        priceToUse: originalItem.priceToUse,
        saved: false

    }
}


function calculateLaborSubTotal(cost, qty){
    const amount = qty ? qty : 1
    return cost*amount
}

function calculateAdvanceSubTotal(cost, qty){
    const amount = qty ? qty : 1
    return cost*amount
}

function calculateUsedPartSubTotal(cost, qty){
    const amount=qty ? qty : 1
    return cost*amount
}

//calculates a simple subtotal based only in the price and qty
function calculatePartSubtotal(part, qty){
    return part.price * qty
}

