let inspect = require('util-inspect')
const uuidv1 = require('uuid/v1')

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
        return part.part.code == code || part.part.barcode == code

    })
            

    console.log('index in part --> ' + indexInPartsRequestList)

    const next_action = (indexInPartsRequestList == -1)
    ?{
        type: 'ADD_TO_PARTS_LIST',
        payload:{
            uuid: uuidv1(),
            part:parts[targetPartIndex],
            qty: qty
        }
    }
    :{
        type: 'UPDATE_PARTS_LIST',
        payload: {
            part: updatePartInTransactionList(partsRequestList, indexInPartsRequestList, qty),
            index: indexInPartsRequestList
        }
    }

return next_action
}

function updatePartInTransactionList(partsRequestList, indexInPartsRequestList, additional_qty){
    //for now, this function will only calculate the new quantity required
    console.log('UPDATE part in list')
    const originalItem = partsRequestList[indexInPartsRequestList]
    return {
        uuid: originalItem.uuid,
        part: originalItem.part,
        qty: originalItem.qty + additional_qty
    }
}