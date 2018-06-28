import {validateInventory} from './actions.js'
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

    sales_warehouse: '',
  
}


export default function reducer(state=stateConst, action){

    switch(action.type){

        case 'CLEAR_WORKSHOPVIEW':
        {
            return {
                ...state,
                cashAdvancesToDelete: [],
                partsRequestToDelete: [],
                laborsToDelete: [],
                usedPartsToDelete: [],
            }
        }

        case 'SET_SALES_WAREHOUSE':
        {
            return {
                ...state,
                sales_warehouse: action.payload
            }
        }
        case 'CLEAR_SALES_WAREHOUSE':
        {
            return {
                ...state,
                sales_warehouse: ''
            }
        }
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

                partsRequestList : [],

                laborList: [],

                usedPartList: [],
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
            const newUsedToDelete = [...state.usedPartsToDelete]
            newUsedToDelete.push(state.usedPartList[index_in_used].element.id)
            
            const new_list = [...state.usedPartList]
            new_list.splice(index_in_used, 1)

            return {
                ...state,
                usedPartList: new_list,
                usedPartsToDelete: newUsedToDelete
            }

        }
        case 'PART_REQUEST_DELETED':
        {
            const index_part_request =  state.partsRequestList.findIndex(a=>a.uuid === action.payload)
            const newPartsRequestToDelete = [...state.partsRequestToDelete]
            newPartsRequestToDelete.push(state.partsRequestList[index_part_request].uuid)

            const new_list = [...state.partsRequestList]
            new_list.splice(index_part_request, 1)

            return {
                ...state,
                partsRequestList: new_list,
                partsRequestToDelete: newPartsRequestToDelete,
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

            const used_objects = action.payload.used_objects.map(item=>{
                const used = JSON.parse(JSON.stringify(item))
                used.employee = JSON.parse(used.employee)
                return used
            })

            const new_used_list = used_objects.map(used=>{
                const used_object = {
                    element: used,
                    priceToUse: used.amount,
                    qty: 1,
                    subTotal: used.amount,
                    type: 'USED_PART',
                    uuid: used.id,
                    saved: true
                }
                return used_object
            })

            const parts_request_objects = action.payload.part_requests.map(item=>{
                const req = JSON.parse(JSON.stringify(item))
                req.product = JSON.parse(req.product)
                try {
                    req.employee = JSON.parse(req.employee)
                } catch(err){
                    console.log(err)
                }
                return req
            })

            const new_parts_request_list = parts_request_objects.map(req=>{

                const req_object = {
                    element: req.product,
                    priceToUse: (parseFloat(req.amount)*parseFloat(req.product.sell_price)).toFixed(2),
                    qty: req.amount,
                    subTotal: (parseFloat(req.amount)*parseFloat(req.product.sell_price)).toFixed(2),
                    type: 'PART_REQUEST',
                    uuid: req.id,
                    saved: true,
                    part_request_group: req.part_request_group
                }
                return req_object
            })


            return {
                ...state,
                cashAdvanceList: new_cash_list,
                laborList: new_labor_list,
                usedPartList: new_used_list,
                partsRequestList: new_parts_request_list,
                cashAdvancesToDelete: [],
                partsRequestToDelete: [],
                laborsToDelete: [],
                usedPartsToDelete: [],
            }

        }
        case 'PARTS_REQUEST_LOADED':
        {
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
            //console.log('Payload ' + inspect(action.payload))
            let is_valid = validateInventory(action.payload.element, action.payload.qty, 
                                                state.sales_warehouse)
            
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