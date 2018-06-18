import alertify from 'alertifyjs'
let inspect = require('util-inspect')

const work_order_model = {
    id:'',
    consecutive:'',
    is_closed : false,
    receiving_employee : 'Receiving Employee',
    technician:'Technician',
    client:'Client',
    client_id:'client id',
    article_type: '',
    article_brand: '',
    article_model: '',
    article_serial: '',
    article_color : '',
    article_data: '',
    malfunction_details: [],
    observations_list:[],
    observations: 'No observations',
    is_warranty:false,
    warranty_number_bd:'',
    warranty_invoice_date:'',
    warranty_supplier_name:'',
    warranty_invoice_number:'',
    warranty_repaired_by:''

}

const stateConst = {
    cashAdvanceList: [],
    cashAdvancesToDelete: [],

    partsRequestList: [],
    partsRequestToDelete: [],

    laborList: [],
    laborsToDelete: [],

    usedPartList: [],
    usedPartsToDelete: [],
  
}


export default function reducer(state=stateConst, action){

    switch(action.type){

        case 'LABOR_UPDATED':
        {
            const newLaborList = [...state.laborList]
            newLaborList[action.payload.index] = action.payload.item
            return {
                ...state,
                laborList:newLaborList
            }
        }
        case 'CASH_ADVANCE_UPDATED':
        {
            const newCashList = [...state.cashAdvanceList]
            newCashList[action.payload.index] = action.payload.item
            return {
                ...state,
                cashAdvanceList: newCashList
            }
        }
        case 'USED_PART_UPDATED':
        {
            const newUsedPartList = [...state.usedPartList]
            newUsedPartList[action.payload.index] = action.payload.item
            return {
                ...state,
                usedPartList : newUsedPartList
            }
        }
        case 'CLEAR_TRANSACTIONS_LIST':
        {

            return{
                ...state,
                cashAdvanceList : [],
                cashAdvanceListOld: [],

                partsRequestList : [],
                partsRequestListOld: [],

                laborList: [],
                laborListOld: [],

                usedPartList: [],
                usedPartListOld: [],
            }
        }
        case 'CASH_ADVANCE_DELETED':
        {
            const index_in_cash = state.cashAdvanceList.findIndex(a=>a.uuid === action.payload)
            const newCashToDelete = [...state.cashAdvancesToDelete]
            newCashToDelete.push(state.cashAdvanceList[index_in_cash].element.id)

            const new_list = [...state.cashAdvanceList]
            new_list.splice(index_in_cash,1)

            return {
                ...state, 
                cashAdvanceList:new_list,
                cashAdvancesToDelete: newCashToDelete
            }
        }
        case 'LABOR_ITEM_DELETED':
        {
            const index_in_labor = state.laborList.findIndex(a=>a.uuid === action.payload)
            const newLaborToDelete = [...state.laborsToDelete]
            newLaborToDelete.push(state.laborList[index_in_labor].element.id)
            
            const new_list = [...state.laborList]
            new_list.splice(index_in_labor, 1)


            return {
                ...state,
                laborList:new_list,
                laborsToDelete: newLaborToDelete
            }

        }
        case 'USED_PART_DELETED':
        {
            const index_in_used = state.usedPartList.findIndex(a=>a.uuid === action.payload)
            const index_in_used_old = state.usedPartListOld.findIndex(a=>a.uuid === action.payload)
            
            const new_list = [...state.usedPartList]
            new_list.splice(index_in_used, 1)

            const new_old = [...state.usedPartListOld]
            new_old.splice(index_in_used_old, 1)
            return {
                ...state,
                usedPartList:new_list,
                usedPartListOld:new_old
            }

        }
        case 'PART_REQUEST_DELETED':
        {
            const index_part_request =  state.partsRequestList.findIndex(a=>a.uuid === action.payload)
            const index_part_request_old = state.partsRequestListOld.findIndex(a=>a.uuid===action.payload)

            const new_list = [...state.partsRequestList]
            new_list.splice(index_part_request, 1)

            const new_old = [...state.partsRequestListOld]
            new_old.splice(index_part_request_old, 1)

            return {
                ...state,
                partsRequestList: new_list,
                partsRequestListOld: new_old
            }
        }
        case 'LABOR_LOADED':
        {
            const labor_objects = action.payload.map(item=>{
                const labor = {
                    id:item.id,
                    work_order_id: item.work_order_id,
                    employee: JSON.parse(item.employee),
                    amount:item.amount,
                    description: item.description,
                    created: item.created,
                    updated: item.updated
                }
                return labor
            })

            const new_labor_list = labor_objects.map(labor=>{
                const labor_item = {
                    element:labor,
                    priceToUse: labor.amount,
                    qty:1,
                    subTotal: labor.amount,
                    type: 'LABOR',
                    uuid:labor.id,
                    saved: true
                }
                return labor_item
            })

            const new_old_list = new_labor_list

            return {
                ...state,
                laborList: new_labor_list,
                laborListOld: new_old_list
            }
        }
        case 'USED_PARTS_LOADED':
        {
            const part_objects = action.payload.map(item=>{
                const part = {
                    id:item.id,
                    work_order_id: item.work_order_id,
                    employee: JSON.parse(item.employee),
                    amount:item.amount,
                    description: item.description,
                    created: item.created,
                    updated: item.updated
                }
                return part
            })

            const new_part_list = part_objects.map(part=>{
                const part_item = {
                    element:part,
                    priceToUse: part.amount,
                    qty:1,
                    subTotal: part.amount,
                    type: 'USED_PART',
                    uuid:part.id,
                    saved: true
                }
                return part_item
            })

            const new_old_list = JSON.parse(JSON.stringify(new_part_list))

            return {
                ...state,
                usedPartList: new_part_list,
                usedPartListOld: new_old_list
            }
        }
        case 'SET_WORK_ORDER_VIEW':
        {
            console.log("SETTING CASH AT TRANSACTION LIST")
            const cash_objects = action.payload.cash_advances.map(item=>{
                const cash = {
                    id:item.id,
                    consecutive:item.consecutive,
                    client: JSON.parse(item.client),
                    client_id: item.client_id,
                    user: JSON.parse(item.user),
                    amount: item.amount,
                    description: item.description,
                    created: item.created,
                    updated: item.updated,
                    sale_id: item.sale_id,
                    work_order_id: item.work_order_id
                }

                return cash
            })
            
            console.log("SETTING_LABOR AT TRANSACTION_LIST")
            const new_cash_list = cash_objects.map(cash =>{
                const cash_item = {
                    element: cash,
                    priceToUse: cash.amount,
                    qty:1,
                    subTotal: cash.amount,
                    type: 'CASH_ADVANCE',
                    uuid:cash.id,
                    saved : true
                }
                
                return cash_item
            })


            const labor_objects = action.payload.labor_objects.map(item=>{
                const labor = JSON.parse(JSON.stringify(item))
                labor.employee = JSON.parse(labor.employee)
                return labor
            })
            const new_labor_list = labor_objects.map(labor=>{
                const labor_object = {
                    element: labor,
                    priceToUse: labor.amount,
                    qty: 1,
                    subTotal: labor.amount,
                    type: 'LABOR',
                    uuid: labor.id,
                    saved: true
                }
                return labor_object
            })
            return {
                ...state,
                cashAdvanceList: new_cash_list,
                laborList: new_labor_list
            }

        }
        case 'PARTS_REQUEST_LOADED':
        {
            console.log('PARTS REQUEST LOADED')
            const parts_objects = action.payload.map(item=>{
                //console.log(item)
                const part = {
                    id:item.id,
                    work_order_id:item.work_order_id,
                    employee:JSON.parse(item.employee),
                    amount:item.amount,
                    product:JSON.parse(item.product),
                    id_movement_workshop: item.id_movement_workshop,
                    id_movement_origin: item.id_movement_origin,
                    created:item.created,
                    updated:item.updated
                }
                return part
            })

            const new_part_objects = parts_objects.map(part=>{
                const new_item = {
                    element: part.product,
                    priceToUse: part.product.price,
                    qty:part.amount,
                    subTotal: part.product.cost*part.amount,
                    type: 'PART_REQUEST',
                    uuid: part.id,
                    work_order_id: part.work_order_id,
                    id:part.id,
                    saved:true
                }
                return new_item
            })

            return {
                ...state,
                partsRequestList: new_part_objects
            }
        }
        case 'PARTS_REQUEST_CREATED':
        {
            console.log('Parts request created')
            const parts_objects = action.payload.map(item=>{
                const part = {
                    id:item.id,
                    work_order_id:item.work_order_id,
                    employee:JSON.parse(item.employee),
                    amount:item.amount,
                    product:JSON.parse(item.product),
                    id_movement_workshop: item.id_movement_workshop,
                    id_movement_origin: item.id_movement_origin,
                    created:item.created,
                    updated:item.updated
                }
                return part
            })

            const new_part_objects = parts_objects.map(part=>{
                const new_item = {
                    element: part.product,
                    priceToUse: part.product.price,
                    qty:part.amount,
                    subTotal: part.product.cost*part.amount,
                    type: 'PART_REQUEST',
                    uuid: part.id,
                    work_order_id: part.work_order_id,
                    id:part.id,
                    saved:true
                }
                return new_item
            })
            
 
            const new_parts_list = (state.partsRequestList.concat(new_part_objects)).filter(a=>{
                return a.saved === true
            })
            return {
                ...state,
                partsRequestList: new_parts_list
            }
        }
        case 'CASH_ADVANCE_MOVEMENTS_CREATED':
        {
            const cash_objects = action.payload.map(item=>{
                const cash = {
                    id:item.id,
                    consecutive:item.consecutive,
                    client: JSON.parse(item.client),
                    client_id: item.client_id,
                    user: JSON.parse(item.user),
                    amount:item.amount,
                    description: item.description,
                    created:item.created,
                    updated:item.updated,
                    sale_id: item.sale_id,
                    work_order_id: item.work_order_id
                }
                return cash
            })
            
            const new_cash_items = cash_objects.map(cash=>{
                const item = {
                    element:cash,
                    priceToUse:cash.amount,
                    qty:1,
                    subTotal:cash.amount,
                    type: 'CASH_ADVANCE',
                    uuid: cash.id,
                    saved:true
                }
                return item
            })

            const new_cash_list = (state.cashAdvanceList.concat(new_cash_items)).filter(a=>{
                return a.uuid === a.element.id
            })

            return {
                ...state,
                cashAdvanceList: new_cash_list
            }
        }
        case 'USED_PART_MOVEMENTS_CREATED':
        {
            const part_objects = action.payload.map(item =>{
                const part = {
                    id:item.id,
                    work_order_id:item.work_order_id,
                    employee: JSON.parse(item.employee),
                    amount: item.amount,
                    description: item.description,
                    created: item.created,
                    updated: item.updated
                }
                return part
            })

            const new_part_items = part_objects.map(part =>{
                const item = {
                    element:part,
                    priceToUse:part.amount,
                    qty:1,
                    subTotal:part.amount,
                    type: 'USED_PART',
                    uuid:part.id,
                    saved: true
                }
                return item
            })

            const new_part_list = (state.usedPartList.concat(new_part_items)).filter(a=>{
                return a.uuid === a.element.id
            })

            return {
                ...state,
                usedPartList:new_part_list                 
            }
         
        }
        case 'CASH_ADVANCE_MOVEMENTS_PATCHED':
        {
            const cash_objects = action.payload.map(item=>{
                const cash = {
                    id:item.id,
                    consecutive:item.consecutive,
                    client: JSON.parse(item.client),
                    client_id: item.client_id,
                    user: JSON.parse(item.user),
                    amount:item.amount,
                    description: item.description,
                    created:item.created,
                    updated:item.updated,
                    sale_id: item.sale_id,
                    work_order_id: item.work_order_id
                }
                return cash
            })
            
            const new_cash_items = cash_objects.map(cash=>{
                const item = {
                    element:cash,
                    priceToUse:cash.amount,
                    qty:1,
                    subTotal:cash.amount,
                    type: 'CASH_ADVANCE',
                    uuid: cash.id,
                    saved:true
                }
                return item
            })

            const new_cash_list = JSON.parse(JSON.stringify(state.cashAdvanceList))
            for(let item of new_cash_items){
                const index = new_cash_list.findIndex(a=>a.uuid === item.uuid)
                new_cash_list[index] = item
            }

            return {
                ...state,
                cashAdvanceList: new_cash_list
            }
        } 
        case 'USED_PART_MOVEMENTS_PATCHED':
        {
            const part_objects = action.payload.map(item =>{
                const part = {
                    id:item.id,
                    work_order_id:item.work_order_id,
                    employee: JSON.parse(item.employee),
                    amount: item.amount,
                    description: item.description,
                    created: item.created,
                    updated: item.updated
                }
                return part
            })

            const new_part_items = part_objects.map(part =>{
                const item = {
                    element:part,
                    priceToUse:part.amount,
                    qty:1,
                    subTotal:part.amount,
                    type: 'LABOR',
                    uuid:part.id,
                    saved: true
                }
                return item
            })

            const new_part_list = JSON.parse(JSON.stringify(state.usedPartList))
            
            for (let item of new_part_items){
                const index = new_labor_list.findIndex(a=>a.uuid===item.uuid)
                new_part_list[index] = item
            }

            return {
                ...state,
                usedPartList:new_part_list
            }

        }
        case 'LABOR_MOVEMENTS_PATCHED':
        {
            console.log("Labor Items patched")
            const labor_objects = action.payload.map(item =>{
                const labor = {
                    id:item.id,
                    work_order_id:item.work_order_id,
                    employee: JSON.parse(item.employee),
                    amount: item.amount,
                    description: item.description,
                    created: item.created,
                    updated: item.updated
                }
                return labor
            })

            const new_labor_items = labor_objects.map(labor =>{
                const item = {
                    element:labor,
                    priceToUse:labor.amount,
                    qty:1,
                    subTotal:labor.amount,
                    type: 'LABOR',
                    uuid:labor.id,
                    saved: true
                }
                return item
            })

            const new_labor_list = JSON.parse(JSON.stringify(state.laborList))
            
            for (let item of new_labor_items){
                const index = new_labor_list.findIndex(a=>a.uuid===item.uuid)
                new_labor_list[index] = item
            }

            return {
                ...state,
                laborList:new_labor_list
            }

        }
        case 'LABOR_MOVEMENTS_CREATED':
        {

            const labor_objects = action.payload.map(item =>{
                const labor = {
                    id:item.id,
                    work_order_id:item.work_order_id,
                    employee: JSON.parse(item.employee),
                    amount: item.amount,
                    description: item.description,
                    created: item.created,
                    updated: item.updated
                }
                return labor
            })

            const new_labor_items = labor_objects.map(labor =>{
                const item = {
                    element:labor,
                    priceToUse:labor.amount,
                    qty:1,
                    subTotal:labor.amount,
                    type: 'LABOR',
                    uuid:labor.id,
                    saved: true
                }
                return item
            })

            const new_labor_list = (state.laborList.concat(new_labor_items)).filter(a=>{
                return a.uuid === a.element.id
            })

            return {
                ...state,
                laborList:new_labor_list                 
            }
            
        }
        case 'ADD_TO_LABOR_LIST':
        {
            return {
                ...state,
                laborList:[
                    ...state.laborList,
                    action.payload
                ]
            }
        }
        case 'ADD_TO_CASH_ADVANCE_LIST':
        {
            return {
                ...state,
                cashAdvanceList:[
                    ...state.cashAdvanceList,
                    action.payload
                ]
            }
        }
        case 'ADD_TO_USED_PART_LIST':
        {
            return {
                ...state,
                usedPartList:[
                    ...state.usedPartList,
                    action.payload
                ]
            }
        }
        case 'ADD_TO_PARTS_LIST':
        {
            console.log('Payload ' + inspect(action.payload))
            return {
                ...state,
                partsRequestList: [
                    ...state.partsRequestList,
                    action.payload
                ]
            }
        }
        case 'UPDATE_PARTS_LIST':
        { 
            if(action.payload.item.saved){ //disallow updating an already saved item
                console.log('upate not allowed, already saved')
                return 
            }
            const newPartsList = [...state.partsRequestList]
            newPartsList[action.payload.index] = action.payload.item
            return {
                ...state,
                partsRequestList : newPartsList
            }
        }
        case 'DELETE_PART_FROM_LIST':
        {
            const newPartsList = [...state.partsRequestList]
            newPartsList.splice(action.payload.index,1)
            return {
                ...state,
                partsRequestList: newPartsList
            }
        }

    }

    return state
}