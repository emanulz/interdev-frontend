let inspect = require('util-inspect')
const uuidv1 = require('uuid/v1')

export function updateQty(qty, itemsList, target_uuid){
    console.log("Target uuid " + target_uuid)
    const index = itemsList.findIndex(item=>item.uuid == target_uuid)

    const qtyNumber = parseFloat(qty)
     const res = {
         type: 'UPDATE_PARTS_LIST',
         payload: {item:updatePartInTransactionList(itemsList,index, qtyNumber),
                    index: index }
    }
    return res
}

//build a cash advance request
export function buildCashAdvanceRequest(cost, description){
    const subTotal = calculateAdvanceSubTotal(cost)
    return{
        type:'ADD_TO_CASH_ADVANCE_LIST',
        payload:{
            uuid: uuidv1(),
            element:{'cost': cost, 'description':description, 'subTotal': subTotal},
            qty: 1,
            type:'CASH_ADVANCE',
            priceToUse: cost,
            subTotal: subTotal
        }
    }
}

export function buildLaborRequest(cost, description){
    const sub = calculateLaborSubTotal(cost)
    return{
        type:'ADD_TO_LABOR_LIST',
        payload:{
            uuid: uuidv1(),
            element:{'cost': cost, 'description':description},
            qty: 1,
            type:'LABOR',
            priceToUse: cost,
            subTotal: sub
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
    
    const next_action = (indexInPartsRequestList == -1)
    ?{
        type: 'ADD_TO_PARTS_LIST',
        payload:{
            uuid: uuidv1(),
            element:parts[targetPartIndex],
            qty: qty,
            type:'PART_REQUEST',
            subTotal: subTotal,
            priceToUse: parts[targetPartIndex].price

        }
    }
    :{
        type: 'UPDATE_PARTS_LIST',
        payload: {
            item: updatePartInTransactionList(partsRequestList, indexInPartsRequestList, qty),
            index: indexInPartsRequestList
        }
    }

return next_action
}

function updatePartInTransactionList(partsRequestList, indexInPartsRequestList, new_qty){
    //console.log(inspect(partsRequestList))
    //for now, this function will only calculate the new quantity required
    const originalItem = partsRequestList[indexInPartsRequestList]
    console.log(inspect(originalItem))
    return {
        uuid: originalItem.uuid,
        element: originalItem.element,
        qty: new_qty,
        type:originalItem.type,
        subTotal: calculatePartSubtotal(originalItem.element, new_qty),
        priceToUse: originalItem.priceToUse

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

//calculates a simple subtotal based only in the price and qty
function calculatePartSubtotal(part, qty){
    return part.price * qty
}

