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
    cashAdvanceListOld:[],

    partsRequestList: [],
    partsRequestListOld: [],

    laborList: [],
    laborListOld: []
  
}


export default function reducer(state=stateConst, action){

    switch(action.type){

        //loads and uses the work order data only for display purposes
        case 'LOAD_WORK_ORDER_INFO':
        {
            console.log("LOAD WORK ORDER DATA FOR WORKVIEW")
        }

        case 'CLEAR_TRANSACTIONS_LIST':
        {
            
            //newCashAdvanceList = []
            //newPartsRequestList = []
            //newLaborList = []
            return{
                ...state,
                cashAdvanceList : [],
                partsRequestList : [],
                laborList : []
            }
        }

        case 'LABOR_LOADED':
        {
            const labor_objects = action.payload.map(item=>{
                const labor = {
                    id:item.id,
                    work_order_id: item.work_order_id,
                    employee: JSON.parse(item.employee),
                    cost:item.cost,
                    description: item.description,
                    created: item.created,
                    updated: item.updated
                }
                return labor
            })

            const new_labor_list = labor_objects.map(labor=>{
                const labor_item = {
                    element:labor,
                    priceToUse: labor.cost,
                    qty:1,
                    subTotal: labor.cost,
                    type: 'LABOR',
                    uuid:labor.id
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

        case 'CASH_ADVANCES_LOADED':
        {
            console.log('loaded cash advance')
    
            const cash_objects = action.payload.map(item=>{
               
                const cash = {
                    id:item.id,
                    consecutive:item.consecutive,
                    client: JSON.parse(item.client),
                    client_id: item.client_id,
                    user: JSON.parse(item.user),
                    amount: item.amount,
                    description: item.description,
                    created: item.created,
                    updated: item.updated
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
                    uuid:cash.id
                }
                return cash_item
            })
            const new_old_list = new_cash_list.map(item=>item)
            return {
                ...state,
                cashAdvanceList:new_cash_list,
                cashAdvanceListOld: new_old_list
            }

        }

        case 'LABOR_MOVEMENTS_CREATED':
        {
            const labor_objects = action.payload.map(item =>{
                const labor = {
                    id:item.id,
                    work_order_id:item.work_order_id,
                    employee: JSON.parse(item.employee),
                    cost: item.cost,
                    description: item.description,
                    created: item.created,
                    updated: item.updated
                }
                return labor
            })

            const new_labor_list = labor_objects.map(labor =>{
                const item = {
                    element:labor,
                    priceToUse:labor.cost,
                    qty:1,
                    subTotal:labor.cost,
                    type: 'LABOR',
                    uuid:labor.id
                }
                return item
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

        case 'ADD_TO_PARTS_LIST':
        {
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
        default:
        {

        }
    }

    return state
}